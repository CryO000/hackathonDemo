from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.reading import SensorReading
from app.models.sensor import Sensor
from app.schemas.reading import ReadingCreate, ReadingRead

router = APIRouter(prefix="/readings", tags=["sensor readings"])


@router.get("", response_model=list[ReadingRead])
async def list_readings(
    sensor_id: int | None = None,
    start: datetime | None = None,
    end: datetime | None = None,
    limit: int = Query(default=100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
):
    query = select(SensorReading).order_by(SensorReading.recorded_at.desc()).limit(limit)
    if sensor_id is not None:
        query = query.where(SensorReading.sensor_id == sensor_id)
    if start is not None:
        query = query.where(SensorReading.recorded_at >= start)
    if end is not None:
        query = query.where(SensorReading.recorded_at <= end)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=ReadingRead, status_code=status.HTTP_201_CREATED)
async def create_reading(payload: ReadingCreate, db: AsyncSession = Depends(get_db)):
    if await db.get(Sensor, payload.sensor_id) is None:
        raise HTTPException(status_code=404, detail="Sensor not found")
    reading = SensorReading(**payload.model_dump())
    db.add(reading)
    await db.commit()
    await db.refresh(reading)
    return reading
