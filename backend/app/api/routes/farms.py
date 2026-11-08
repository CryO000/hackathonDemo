from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmRead

router = APIRouter(prefix="/farms", tags=["farms"])


@router.get("", response_model=list[FarmRead])
async def list_farms(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).order_by(Farm.id))
    return result.scalars().all()


@router.post("", response_model=FarmRead, status_code=status.HTTP_201_CREATED)
async def create_farm(payload: FarmCreate, db: AsyncSession = Depends(get_db)):
    farm = Farm(**payload.model_dump())
    db.add(farm)
    await db.commit()
    await db.refresh(farm)
    return farm


@router.get("/{farm_id}", response_model=FarmRead)
async def get_farm(farm_id: int, db: AsyncSession = Depends(get_db)):
    farm = await db.get(Farm, farm_id)
    if farm is None:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm
