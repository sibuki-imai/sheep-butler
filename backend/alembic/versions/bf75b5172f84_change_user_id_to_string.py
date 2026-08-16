from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "bf75b5172f84"
down_revision: Union[str, Sequence[str], None] = "91cf489bdfd6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Foreign Keyを一旦削除
    op.drop_constraint(
        "accounting_basic_user_id_fkey",
        "accounting_basic",
        type_="foreignkey",
    )

    op.drop_constraint(
        "accounting_record_user_id_fkey",
        "accounting_record",
        type_="foreignkey",
    )

    # users.id: UUID -> VARCHAR
    op.alter_column(
        "users",
        "id",
        existing_type=sa.UUID(),
        type_=sa.String(),
        existing_nullable=False,
    )

    # accounting_basic.user_id: UUID -> VARCHAR
    op.alter_column(
        "accounting_basic",
        "user_id",
        existing_type=sa.UUID(),
        type_=sa.String(),
        existing_nullable=False,
    )

    # accounting_record.user_id: UUID -> VARCHAR
    op.alter_column(
        "accounting_record",
        "user_id",
        existing_type=sa.UUID(),
        type_=sa.String(),
        existing_nullable=False,
    )

    # Foreign Keyを張り直す
    op.create_foreign_key(
        "accounting_basic_user_id_fkey",
        "accounting_basic",
        "users",
        ["user_id"],
        ["id"],
    )

    op.create_foreign_key(
        "accounting_record_user_id_fkey",
        "accounting_record",
        "users",
        ["user_id"],
        ["id"],
    )

    # google_id削除
    op.drop_column("users", "google_id")


def downgrade() -> None:
    # google_idを戻す
    op.add_column(
        "users",
        sa.Column(
            "google_id",
            sa.VARCHAR(),
            nullable=False,
        ),
    )

    # Foreign Keyを削除
    op.drop_constraint(
        "accounting_basic_user_id_fkey",
        "accounting_basic",
        type_="foreignkey",
    )

    op.drop_constraint(
        "accounting_record_user_id_fkey",
        "accounting_record",
        type_="foreignkey",
    )

    # VARCHAR → UUID
    op.alter_column(
        "accounting_basic",
        "user_id",
        existing_type=sa.String(),
        type_=sa.UUID(),
        existing_nullable=False,
    )

    op.alter_column(
        "accounting_record",
        "user_id",
        existing_type=sa.String(),
        type_=sa.UUID(),
        existing_nullable=False,
    )

    op.alter_column(
        "users",
        "id",
        existing_type=sa.String(),
        type_=sa.UUID(),
        existing_nullable=False,
    )

    # Foreign Keyを戻す
    op.create_foreign_key(
        "accounting_basic_user_id_fkey",
        "accounting_basic",
        "users",
        ["user_id"],
        ["id"],
    )

    op.create_foreign_key(
        "accounting_record_user_id_fkey",
        "accounting_record",
        "users",
        ["user_id"],
        ["id"],
    )
