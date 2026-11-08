from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.field import Field
from app.models.sensor import Sensor
from app.schemas.sensor import SensorCreate, SensorRead

router = APIRouter(prefix="/sensors", tags=["sensors"])


@router.get("", response_model=list[SensorRead])
async def list_sensors(field_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Sensor).order_by(Sensor.id)
    if field_id is not None:
        query = query.where(Sensor.field_id == field_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=SensorRead, status_code=status.HTTP_201_CREATED)
async def create_sensor(payload: SensorCreate, db: AsyncSession = Depends(get_db)):
    if await db.get(Field, payload.field_id) is None:
        raise HTTPException(status_code=404, detail="Field not found")
    sensor = Sensor(**payload.model_dump())
    db.add(sensor)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="A sensor with this sensor_code already exists")
    await db.refresh(sensor)
    return sensor
