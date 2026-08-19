import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base


class AccountingBasic(Base):
    __tablename__ = "accounting_basic"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "sort",
            name="uq_accounting_basic_user_sort",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    icon: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    collar: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    sort: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    fixed_money: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    remaining_balance: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )
