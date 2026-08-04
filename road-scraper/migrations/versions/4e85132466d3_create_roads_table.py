"""create roads table

Revision ID: 4e85132466d3
Revises:
Create Date: 2026-07-28 14:54:39.615660
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "4e85132466d3"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "roads",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("osm_id", sa.BigInteger(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("highway", sa.String(length=64), nullable=True),
        sa.Column("surface", sa.String(length=64), nullable=True),
        sa.Column("oneway", sa.String(length=16), nullable=True),
        sa.Column("maxspeed", sa.String(length=32), nullable=True),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column("raw_tags", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("osm_id", name="uq_roads_osm_id"),
    )
    op.create_index(op.f("ix_roads_osm_id"), "roads", ["osm_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_roads_osm_id"), table_name="roads")
    op.drop_table("roads")
