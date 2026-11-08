from pydantic import BaseModel, ConfigDict, Field


class FieldCreate(BaseModel):
    farm_id: int
    name: str = Field(min_length=1, max_length=120)
    boundary_geojson: str | None = None
    area_hectares: float | None = Field(default=None, gt=0)


class FieldRead(FieldCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
