# Agriculture data analysis app

This repository contains the Vite + React agriculture monitoring frontend and a Python FastAPI backend.

## Run the backend

From the repository root (Docker required):

```bash
docker compose up --build
```

In another terminal, seed the demo farm, fields, sensors, and readings:

```bash
docker compose exec api python -m scripts.seed_demo
```

## Run the frontend

In a separate terminal, from the repository root:

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Interactive API documentation: http://localhost:8000/docs

For local Python setup, Supabase PostgreSQL connection, API examples, and migrations, see **[backend/README.md](backend/README.md)**.
