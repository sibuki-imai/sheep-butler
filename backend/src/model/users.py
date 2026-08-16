import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base


class Power(str, Enum):
    PRIME = "prime"
    GENERAL = "general"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
    )

    power: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )
