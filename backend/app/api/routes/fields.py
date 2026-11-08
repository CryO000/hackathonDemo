from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.farm import Farm
from app.models.field import Field
from app.schemas.field import FieldCreate, FieldRead

router = APIRouter(tags=["fields"])


@router.get("/fields", response_model=list[FieldRead])
async def list_fields(farm_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Field).order_by(Field.id)
    if farm_id is not None:
        query = query.where(Field.farm_id == farm_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/fields", response_model=FieldRead, status_code=status.HTTP_201_CREATED)
async def create_field(payload: FieldCreate, db: AsyncSession = Depends(get_db)):
    if await db.get(Farm, payload.farm_id) is None:
        raise HTTPException(status_code=404, detail="Farm not found")
    field = Field(**payload.model_dump())
    db.add(field)
    await db.commit()
    await db.refresh(field)
    return field
