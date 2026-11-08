from pydantic import BaseModel, ConfigDict, Field


class FarmCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    location: str | None = None
    description: str | None = None


class FarmRead(FarmCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
