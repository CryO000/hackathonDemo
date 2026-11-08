from sqlalchemy import ForeignKey, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Field(TimestampMixin, Base):
    __tablename__ = "fields"
    id: Mapped[int] = mapped_column(primary_key=True)
    farm_id: Mapped[int] = mapped_column(ForeignKey("farms.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    boundary_geojson: Mapped[str | None] = mapped_column(String)
    area_hectares: Mapped[float | None] = mapped_column(Float)
    farm = relationship("Farm", back_populates="fields")
    sensors = relationship("Sensor", back_populates="field", cascade="all, delete-orphan")
