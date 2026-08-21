import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base


class AccountingRecord(Base):
    __tablename__ = "accounting_record"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    accounting_basic_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("accounting_basic.id"),
        nullable=False,
    )

    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    purchase_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    item_name: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    memo: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )
