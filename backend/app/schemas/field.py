from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class FieldCreate(BaseModel):
    farm_id: int
    name: str = Field(min_length=1, max_length=120)
    # GeoJSON Polygon or MultiPolygon using WGS84 coordinates.
    boundary_geojson: dict[str, Any] | None = None
    area_hectares: float | None = Field(default=None, gt=0)


class FieldRead(BaseModel):
    id: int
    farm_id: int
    name: str
    boundary_geojson: dict[str, Any] | None = None
    area_hectares: float | None = None
    model_config = ConfigDict(from_attributes=True)
