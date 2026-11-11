
# Dust2Farm

Dust2Farm is an agriculture data analysis app. The frontend is a Vite/React
application; the backend is a Spring Boot service backed by PostgreSQL with
PostGIS.

## Frontend

Install dependencies with `npm install`, then start the development server with
`npm run dev`.

## Backend (local development)

Requirements: Java 21+, Maven, Docker, and Docker Compose.

1. Copy `.env.example` to `.env`.
2. From the repository root, start the API and PostGIS database:

   ```sh
   docker compose up --build
   ```

3. Visit <http://localhost:8000/health> for the service health endpoint.
   Flyway applies database migrations when the API container starts.

To run the API or migrations directly on the host instead, first start only the
database with `docker compose up -d db`, then install and run the backend:

```sh
cd backend
mvn spring-boot:run
```

The backend defaults to `jdbc:postgresql://localhost:5432/dust2farm` with the
same local credentials as `.env.example`. Compose loads `.env` automatically;
for a host-run backend, set `SPRING_DATASOURCE_URL`,
`SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` in your shell to
override the defaults.
  