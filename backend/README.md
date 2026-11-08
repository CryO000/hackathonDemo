# Agriculture Data API

Python backend for the Vite + React agriculture dashboard in this repository.

## Stack

- **FastAPI**: REST endpoints and interactive OpenAPI docs
- **PostgreSQL**: relational data storage (the existing Supabase PostgreSQL project can be reused)
- **PostGIS**: real Polygon/MultiPolygon field boundaries in SRID 4326
- **SQLAlchemy 2 + asyncpg**: async database access
- **Pydantic**: request and response validation
- **Alembic**: migration tooling
- **Docker Compose**: local API + PostGIS setup

Redis, Celery, and MQTT are intentionally not enabled yet. Add them when you need queued satellite processing, long-running analysis, or live device telemetry.

## Option A: Run everything with Docker

From the repository root:

```bash
docker compose up --build
```

This starts PostGIS on port 5432 and FastAPI on port 8000. PostGIS is enabled by the init script and the API creates its initial tables when it starts.

Seed the sample farm data so the Dashboard and Analysis pages can load live values:

```bash
docker compose exec api python -m scripts.seed_demo
```

The seed command is safe to run more than once; it skips creation when the demo farm already exists.

- API: http://localhost:8000
- Interactive Swagger docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

To stop the services:

```bash
docker compose down
```

To also remove the local database volume:

```bash
docker compose down -v
```

## Option B: Use your existing Supabase PostgreSQL

In Supabase, open **SQL Editor** and run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Get the connection string from **Project Settings → Database → Connection string**. Set it in `backend/.env` using the async SQLAlchemy driver:

```text
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DATABASE
CORS_ORIGINS=http://localhost:5173
APP_NAME=Agriculture Data API
DEBUG=true
```

Follow the SSL requirements shown by Supabase for your selected direct or pooler connection. Keep this database password server-side; never place it in a `VITE_...` variable or commit `.env`.

Then install and run the backend locally:

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.venv\\Scripts\\Activate.ps1

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

In a second terminal, from the `backend/` directory, seed the demo records:

```bash
python -m scripts.seed_demo
```

The app currently creates missing tables at startup for quick hackathon development. Alembic is configured for schema migrations; before switching the project to migration-managed deployments, generate and review an initial migration against an empty database:

```bash
cd backend
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

Do not run Alembic's initial migration after the app has already auto-created all the tables in the same database; use a fresh database or remove the automatic `create_all` startup when adopting migrations as the source of truth.

## Run backend tests

From inside `backend/` with the virtual environment active:

```bash
pytest
```

The current tests cover Pydantic request validation. Add database-backed integration tests when you configure a dedicated test database.

## API endpoints

All data endpoints use the `/api/v1` prefix.

| Method | Endpoint | Description |
|---|---|---|
| GET, POST | `/farms` | List or create farms |
| GET | `/farms/{farm_id}` | Get one farm |
| GET, POST | `/fields` | List or create fields; optional `farm_id` filter |
| GET, POST | `/sensors` | List or register sensors; optional `field_id` filter |
| GET, POST | `/readings` | Query or insert timestamped measurements |
| GET | `/dashboard/soil` | Latest sensor measurements in the React dashboard's data shape |

Reading query filters: `sensor_id`, `start`, `end`, and `limit` (1–1000).

### Create a farm

```json
{
  "name": "North Farm",
  "location": "Casablanca, Morocco",
  "description": "Hackathon test farm"
}
```

### Register a sensor

```json
{
  "field_id": 1,
  "sensor_code": "NORTH-MOISTURE-01",
  "sensor_type": "moisture",
  "unit": "%",
  "target_value": 40,
  "is_active": true
}
```

### Insert a measurement

```json
{
  "sensor_id": 1,
  "value": 37.5,
  "recorded_at": "2026-11-08T12:00:00Z"
}
```

### Add a field boundary

Send a GeoJSON Polygon or MultiPolygon in WGS84 longitude/latitude coordinates as `boundary_geojson`. The API validates the shape and stores it in the PostGIS `geometry(MULTIPOLYGON, 4326)` column.

## Connect the Vite frontend

At the repository root, copy `.env.example` to `.env.local` and set:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

A typed API client is available in `src/app/services/api.ts`:

```ts
import { agricultureApi } from "./api";

const farms = await agricultureApi.listFarms();
const soil = await agricultureApi.getSoilDashboard();
```

The Dashboard and Analysis pages now call the `/dashboard/soil` endpoint through `useSoilDashboard`. They continue to show the existing `mockSoilData` sample if the API is unavailable or the database has no fields. Once you seed demo data or register your own farm and sensors, the pages switch to live backend values.

## Tables

- `farms`: farm name, location, description
- `fields`: farm relationship, field name, PostGIS boundary, area
- `sensors`: field relationship, unique sensor code, metric type, unit, target, active state
- `sensor_readings`: sensor relationship, numeric value, timestamp

Metric types include `moisture`, `surface_moisture`, `root_zone_moisture`, `temperature`, `nitrogen`, `phosphorus`, `potassium`, and `ph`.

## Before deployment

1. Add Supabase Auth/JWT verification and per-farm authorization to the API.
2. Turn off automatic `create_all` startup and deploy reviewed Alembic migrations.
3. Validate farm ownership and add database Row Level Security where appropriate.
4. Add Redis/Celery for asynchronous satellite-image processing or model inference.
5. Add MQTT only when real sensors/devices need to publish telemetry.
6. Add rate limiting, structured logging, and deployment secrets.
