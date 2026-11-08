"""Seed the database with demo data matching the existing agriculture dashboard."""
import asyncio
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.database import AsyncSessionLocal, engine
from app.models.farm import Farm
from app.models.field import Field
from app.models.reading import SensorReading
from app.models.sensor import Sensor

DEMO_FIELDS = [
    {
        "name": "North Sector",
        "moisture": 45, "surface_moisture": 48, "root_zone_moisture": 39,
        "temperature": 22.5, "ph": 6.5,
        "nutrients": [
            ("nitrogen", "Nitrogen", "N-01", 120, 150),
            ("phosphorus", "Phosphorus", "P-02", 45, 100),
            ("potassium", "Potassium", "K-03", 150, 160),
            ("magnesium", "Magnesium", "MG-04", 92, 100),
            ("calcium", "Calcium", "CA-05", 98, 110),
            ("sulfur", "Sulfur", "S-06", 73, 90),
        ],
    },
    {
        "name": "East Sector",
        "moisture": 38, "surface_moisture": 41, "root_zone_moisture": 33,
        "temperature": 24.1, "ph": 6.8,
        "nutrients": [
            ("nitrogen", "Nitrogen", "N-01", 110, 150),
            ("phosphorus", "Phosphorus", "P-02", 40, 100),
            ("potassium", "Potassium", "K-03", 140, 160),
            ("magnesium", "Magnesium", "MG-04", 88, 100),
            ("calcium", "Calcium", "CA-05", 95, 110),
            ("sulfur", "Sulfur", "S-06", 70, 90),
        ],
    },
    {
        "name": "South Sector",
        "moisture": 52, "surface_moisture": 56, "root_zone_moisture": 48,
        "temperature": 21.8, "ph": 6.2,
        "nutrients": [
            ("nitrogen", "Nitrogen", "N-01", 130, 150),
            ("phosphorus", "Phosphorus", "P-02", 50, 100),
            ("potassium", "Potassium", "K-03", 160, 160),
            ("magnesium", "Magnesium", "MG-04", 96, 100),
            ("calcium", "Calcium", "CA-05", 102, 110),
            ("sulfur", "Sulfur", "S-06", 78, 90),
        ],
    },
]


async def seed() -> None:
    async with AsyncSessionLocal() as db:
        existing = await db.execute(select(Farm).where(Farm.name == "Hackathon Demo Farm"))
        if existing.scalar_one_or_none() is not None:
            print("Demo farm already exists; no data was changed.")
            return

        farm = Farm(
            name="Hackathon Demo Farm",
            location="Demo location",
            description="Sample data for the agriculture hackathon dashboard.",
        )
        db.add(farm)
        await db.flush()

        now = datetime.now(timezone.utc)
        for field_data in DEMO_FIELDS:
            field = Field(farm_id=farm.id, name=field_data["name"])
            db.add(field)
            await db.flush()

            metrics = [
                ("moisture", "Soil Moisture", "MOISTURE", "%", field_data["moisture"], field_data["moisture"]),
                ("surface_moisture", "Surface Moisture", "SURFACE", "%", field_data["surface_moisture"], field_data["surface_moisture"]),
                ("root_zone_moisture", "Root-zone Moisture", "ROOT", "%", field_data["root_zone_moisture"], field_data["root_zone_moisture"]),
                ("temperature", "Temperature", "TEMP", "°C", field_data["temperature"], field_data["temperature"]),
                ("ph", "pH", "PH", "pH", field_data["ph"], field_data["ph"]),
            ]
            metrics.extend(
                (metric_key, label, short_code, "ppm", current, target)
                for metric_key, label, short_code, current, target in field_data["nutrients"]
            )

            for metric_key, label, short_code, unit, value, target in metrics:
                sensor = Sensor(
                    field_id=field.id,
                    sensor_code=f"{field.id}-{short_code}",
                    sensor_type=metric_key,
                    unit=unit,
                    target_value=target,
                    is_active=True,
                )
                db.add(sensor)
                await db.flush()
                db.add(SensorReading(sensor_id=sensor.id, value=value, recorded_at=now))

        await db.commit()
        print("Created one demo farm, three fields, 33 sensors, and 33 readings.")


async def main() -> None:
    try:
        await seed()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
