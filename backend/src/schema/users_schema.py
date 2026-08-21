from pydantic import BaseModel
from enum import Enum
from datetime import datetime


class Power(Enum):
    PRIME = "PRIME"
    GENERAL = "GENERAL"


class UserCreate(BaseModel):
    id: str
    power: Power
    last_login: datetime
