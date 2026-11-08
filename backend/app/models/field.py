from geoalchemy2 import Geometry
from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Field(TimestampMixin, Base):
    __tablename__ = "fields"

    id: Mapped[int] = mapped_column(primary_key=True)
    farm_id: Mapped[int] = mapped_column(ForeignKey("farms.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    # Field outlines are stored as WGS84 multipolygons (longitude, latitude).
    boundary = mapped_column(Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True), nullable=True)
    area_hectares: Mapped[float | None] = mapped_column(Float)

    farm = relationship("Farm", back_populates="fields")
    sensors = relationship("Sensor", back_populates="field", cascade="all, delete-orphan")
