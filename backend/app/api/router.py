from fastapi import APIRouter
from app.api.routes import farms, fields, health, readings

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(farms.router, prefix="/api/v1")
api_router.include_router(fields.router, prefix="/api/v1")
api_router.include_router(readings.router, prefix="/api/v1")
