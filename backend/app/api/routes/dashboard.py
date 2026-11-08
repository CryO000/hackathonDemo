from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.field import Field
from app.models.reading import SensorReading
from app.models.sensor import Sensor

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

METRIC_ALIASES = {
    "soil_moisture": "moisture",
    "moisture": "moisture",
    "surface_moisture": "surface_moisture",
    "root_zone_moisture": "root_zone_moisture",
    "soil_temperature": "temperature",
    "temperature": "temperature",
    "nitrogen": "nitrogen",
    "phosphorus": "phosphorus",
    "potassium": "potassium",
    "ph": "ph",
}


@router.get("/soil")
async def get_soil_dashboard(db: AsyncSession = Depends(get_db)):
    """Return latest field sensor values in the shape expected by the React soil dashboard."""
    field_result = await db.execute(select(Field).order_by(Field.id))
    fields = field_result.scalars().all()

    sensor_result = await db.execute(select(Sensor).order_by(Sensor.id))
    sensors = sensor_result.scalars().all()
    sensors_by_field: dict[int, list[Sensor]] = defaultdict(list)
    for sensor in sensors:
        sensors_by_field[sensor.field_id].append(sensor)

    sensor_ids = [sensor.id for sensor in sensors]
    latest_by_sensor: dict[int, SensorReading] = {}
    if sensor_ids:
        reading_result = await db.execute(
            select(SensorReading)
            .where(SensorReading.sensor_id.in_(sensor_ids))
            .order_by(SensorReading.recorded_at.desc())
        )
        for reading in reading_result.scalars().all():
            latest_by_sensor.setdefault(reading.sensor_id, reading)

    response = []
    for field in fields:
        latest_values: dict[str, float] = {}
        sensor_readings = []
        timestamps = []

        for sensor in sensors_by_field[field.id]:
            reading = latest_by_sensor.get(sensor.id)
            if reading is None:
                continue

            metric_key = sensor.sensor_type.strip().lower().replace("-", "_").replace(" ", "_")
            dashboard_key = METRIC_ALIASES.get(metric_key, metric_key)
            latest_values[dashboard_key] = reading.value
            timestamps.append(reading.recorded_at)

            sensor_readings.append({
                "nutrient": sensor.sensor_type,
                "sensorId": sensor.sensor_code,
                "current": reading.value,
                "target": sensor.target_value if sensor.target_value is not None else reading.value,
                "unit": sensor.unit,
                "status": "Active" if sensor.is_active else "Inactive",
            })

        if "moisture" not in latest_values:
            layers = [
                latest_values[key]
                for key in ("surface_moisture", "root_zone_moisture")
                if key in latest_values
            ]
            if layers:
                latest_values["moisture"] = sum(layers) / len(layers)

        response.append({
            "id": str(field.id),
            "location": field.name,
            "moisture": latest_values.get("moisture", 0),
            "surfaceMoisture": latest_values.get("surface_moisture", 0),
            "rootZoneMoisture": latest_values.get("root_zone_moisture", 0),
            "temperature": latest_values.get("temperature", 0),
            "nitrogen": latest_values.get("nitrogen", 0),
            "phosphorus": latest_values.get("phosphorus", 0),
            "potassium": latest_values.get("potassium", 0),
            "ph": latest_values.get("ph", 7),
            "freezeState": "Normal",
            "sensorReadings": sensor_readings,
            "lastUpdated": max(timestamps).isoformat() if timestamps else None,
        })

    return response
