"""add natural_features road_scenic_feature and roads geometry

Revision ID: ad555d562d7e
Revises: 4e85132466d3
Create Date: 2026-07-28 15:58:16.030186
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from geoalchemy2 import Geometry

# revision identifiers, used by Alembic.
revision: str = "ad555d562d7e"
down_revision: Union[str, None] = "4e85132466d3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_natural_features_geometry")
    op.execute("DROP TABLE IF EXISTS road_scenic_feature CASCADE")
    op.execute("DROP TABLE IF EXISTS natural_features CASCADE")

    op.create_table(
        "natural_features",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("osm_id", sa.BigInteger(), nullable=False),
        sa.Column("feature_type", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column(
            "geometry",
            Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=False),
            nullable=True,
        ),
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
        sa.UniqueConstraint("osm_id", "feature_type", name="uq_natural_features_osm_type"),
    )
    op.create_index(
        "idx_natural_features_geometry",
        "natural_features",
        ["geometry"],
        unique=False,
        postgresql_using="gist",
    )
    op.create_index(
        op.f("ix_natural_features_feature_type"),
        "natural_features",
        ["feature_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_natural_features_osm_id"),
        "natural_features",
        ["osm_id"],
        unique=False,
    )

    op.create_table(
        "road_scenic_feature",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("road_id", sa.Integer(), nullable=False),
        sa.Column("feature_id", sa.Integer(), nullable=False),
        sa.Column("distance", sa.Float(), nullable=True),
        sa.Column("weight", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(["feature_id"], ["natural_features.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["road_id"], ["roads.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("road_id", "feature_id", name="uq_road_scenic_feature"),
    )

    op.add_column(
        "roads",
        sa.Column(
            "geometry",
            Geometry(geometry_type="LINESTRING", srid=4326, spatial_index=False),
            nullable=True,
        ),
    )
    op.create_index(
        "idx_roads_geometry",
        "roads",
        ["geometry"],
        unique=False,
        postgresql_using="gist",
    )


def downgrade() -> None:
    op.drop_index("idx_roads_geometry", table_name="roads", postgresql_using="gist")
    op.drop_column("roads", "geometry")
    op.drop_table("road_scenic_feature")
    op.drop_index(op.f("ix_natural_features_osm_id"), table_name="natural_features")
    op.drop_index(op.f("ix_natural_features_feature_type"), table_name="natural_features")
    op.drop_index("idx_natural_features_geometry", table_name="natural_features", postgresql_using="gist")
    op.drop_table("natural_features")
