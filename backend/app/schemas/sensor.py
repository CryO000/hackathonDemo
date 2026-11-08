from pydantic import BaseModel, ConfigDict, Field


class SensorCreate(BaseModel):
    field_id: int
    sensor_code: str = Field(min_length=1, max_length=80)
    sensor_type: str = Field(min_length=1, max_length=80)
    unit: str = Field(min_length=1, max_length=30)
    target_value: float | None = None
    is_active: bool = True


class SensorRead(SensorCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
