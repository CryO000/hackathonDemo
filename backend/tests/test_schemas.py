import pytest
from pydantic import ValidationError

from app.schemas.farm import FarmCreate
from app.schemas.field import FieldCreate
from app.schemas.sensor import SensorCreate


def test_farm_name_is_required():
    with pytest.raises(ValidationError):
        FarmCreate(name="")


def test_field_area_must_be_positive():
    with pytest.raises(ValidationError):
        FieldCreate(farm_id=1, name="North", area_hectares=0)


def test_sensor_defaults_to_active():
    sensor = SensorCreate(
        field_id=1,
        sensor_code="N-01",
        sensor_type="nitrogen",
        unit="ppm",
    )
    assert sensor.is_active is True
