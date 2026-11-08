from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ReadingCreate(BaseModel):
    sensor_id: int
    value: float
    recorded_at: datetime


class ReadingRead(ReadingCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
