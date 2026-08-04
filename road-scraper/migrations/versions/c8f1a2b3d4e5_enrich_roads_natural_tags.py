"""Alembic: enrich roads with OSM attrs + natural_tags JSON array."""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "c8f1a2b3d4e5"
down_revision: Union[str, None] = "ad555d562d7e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("roads", sa.Column("bridge", sa.String(length=16), nullable=True))
    op.add_column("roads", sa.Column("tunnel", sa.String(length=16), nullable=True))
    op.add_column("roads", sa.Column("lit", sa.String(length=16), nullable=True))
    op.add_column("roads", sa.Column("lanes", sa.String(length=16), nullable=True))
    op.add_column("roads", sa.Column("incline", sa.String(length=32), nullable=True))
    op.add_column("roads", sa.Column("length_m", sa.Float(), nullable=True))
    op.add_column(
        "roads",
        sa.Column(
            "natural_tags",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )


def downgrade() -> None:
    op.drop_column("roads", "natural_tags")
    op.drop_column("roads", "length_m")
    op.drop_column("roads", "incline")
    op.drop_column("roads", "lanes")
    op.drop_column("roads", "lit")
    op.drop_column("roads", "tunnel")
    op.drop_column("roads", "bridge")
