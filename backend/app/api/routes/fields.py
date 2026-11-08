from fastapi import APIRouter, Depends, HTTPException, status
from geoalchemy2.shape import from_shape, to_shape
from shapely.geometry import MultiPolygon, mapping, shape as make_shape
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.farm import Farm
from app.models.field import Field
from app.schemas.field import FieldCreate, FieldRead

router = APIRouter(tags=["fields"])


def serialize_field(field: Field) -> dict:
    boundary = None
    if field.boundary is not None:
        boundary = mapping(to_shape(field.boundary))
    return {
        "id": field.id,
        "farm_id": field.farm_id,
        "name": field.name,
        "boundary_geojson": boundary,
        "area_hectares": field.area_hectares,
    }


@router.get("/fields", response_model=list[FieldRead])
async def list_fields(farm_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Field).order_by(Field.id)
    if farm_id is not None:
        query = query.where(Field.farm_id == farm_id)
    result = await db.execute(query)
    return [serialize_field(field) for field in result.scalars().all()]


@router.post("/fields", response_model=FieldRead, status_code=status.HTTP_201_CREATED)
async def create_field(payload: FieldCreate, db: AsyncSession = Depends(get_db)):
    if await db.get(Farm, payload.farm_id) is None:
        raise HTTPException(status_code=404, detail="Farm not found")

    boundary = None
    if payload.boundary_geojson is not None:
        try:
            geometry = make_shape(payload.boundary_geojson)
        except (TypeError, ValueError, KeyError):
            raise HTTPException(status_code=422, detail="Invalid GeoJSON geometry")
        if geometry.geom_type == "Polygon":
            geometry = MultiPolygon([geometry])
        if geometry.geom_type != "MultiPolygon" or not geometry.is_valid:
            raise HTTPException(status_code=422, detail="Boundary must be a valid Polygon or MultiPolygon")
        boundary = from_shape(geometry, srid=4326)

    field = Field(
        farm_id=payload.farm_id,
        name=payload.name,
        boundary=boundary,
        area_hectares=payload.area_hectares,
    )
    db.add(field)
    await db.commit()
    await db.refresh(field)
    return serialize_field(field)
