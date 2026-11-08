from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.core.database import engine
from app.models.base import Base
from app.models import Farm, Field, Sensor, SensorReading  # noqa: F401


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Convenient for a local demo. Use Alembic migrations for deployed databases.
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(title=settings.app_name, description="API for the agriculture soil-monitoring dashboard.", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Agriculture Data API", "docs": "/docs"}
