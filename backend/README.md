# Agriculture Data API

Python backend for the Vite + React agriculture dashboard in this repository.

## Stack

- **FastAPI**: REST endpoints and interactive OpenAPI docs
- **PostgreSQL**: relational data storage (you can use the existing Supabase PostgreSQL project)
- **PostGIS**: real Polygon/MultiPolygon field boundaries in SRID 4326
- **SQLAlchemy 2 + asyncpg**: async database access
- **Pydantic**: request and response validation
- **Alembic**: database migration tooling

Redis, Celery, and MQTT are intentionally not enabled yet: add them when the app needs queued satellite processing, long-running jobs, or live device telemetry.

## 1. Prepare the database

Use PostgreSQL locally or the PostgreSQL database already associated with your Supabase project. In Supabase, open **SQL Editor** and run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

PostGIS stores field boundaries as actual geographic geometry rather than plain text.

## 2. Install the backend

From the repository root:

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.venv\\Scripts\\Activate.ps1

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Copy `.env.example` to `.env`. Set `DATABASE_URL` to your PostgreSQL connection string. Keep the database password server-side; do not put it in a `VITE_...` frontend variable or commit `.env`.

For a Supabase database, get the connection string from **Project Settings → Database → Connection string**. Use the async SQLAlchemy driver format:

```text
postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DATABASE
```

Your database/provider may require SSL parameters. Follow the connection details shown by Supabase for your chosen direct or pooler connection.

## 3. Start FastAPI

Run from inside `backend/`:

```bash
uvicorn app.main:app --reload
```

- API root: http://localhost:8000
- Interactive Swagger docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

The app currently creates missing tables at startup for quick local hackathon development. Use Alembic migrations for schema changes and before deployment.

## API endpoints

All data endpoints use the `/api/v1` prefix.

| Method | Endpoint | Description |
|---|---|---|
| GET, POST | `/farms` | List or create farms |
| GET | `/farms/{farm_id}` | Get one farm |
| GET, POST | `/fields` | List or create fields; optional `farm_id` filter |
| GET, POST | `/sensors` | List or register sensors; optional `field_id` filter |
| GET, POST | `/readings` | Query or insert timestamped measurements |
| GET | `/dashboard/soil` | Latest measurements in the existing React soil-dashboard shape |

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

At the repository root, copy `.env.example` to `.env.local` (or create that file) and set:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

A ready-to-use TypeScript client is in `src/app/services/api.ts`. For example:

```ts
import { agricultureApi } from "./api";

const farms = await agricultureApi.listFarms();
const soil = await agricultureApi.getSoilDashboard();
```

The current pages still use `mockSoilData`; this backend and API client are the data layer to connect next, without changing the dashboard UI unexpectedly.

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
