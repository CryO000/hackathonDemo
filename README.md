# Agriculture data analysis app

This repository contains the Vite + React agriculture monitoring frontend and a Python FastAPI backend.

## Frontend

```bash
npm install
npm run dev
```

## Backend

See **[backend/README.md](backend/README.md)** for setup, API endpoints, PostGIS, Supabase PostgreSQL connection, Alembic, and Docker instructions.

Quick local start from the repository root (requires Docker):

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API documentation: http://localhost:8000/docs
