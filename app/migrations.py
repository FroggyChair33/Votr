from sqlalchemy import text
from sqlalchemy.engine import Engine


NEW_USER_COLUMNS = [
    ("university",       "VARCHAR"),
    ("bio",              "VARCHAR"),
    ("graduation_year",  "VARCHAR"),
    ("major",            "VARCHAR"),
    ("has_voted",        "BOOLEAN NOT NULL DEFAULT FALSE"),
    ("vote_count",       "INTEGER NOT NULL DEFAULT 0"),
    ("created_at",       "TIMESTAMPTZ NOT NULL DEFAULT NOW()"),
]


def run_migrations(engine: Engine) -> None:
    with engine.connect() as conn:
        for col_name, col_def in NEW_USER_COLUMNS:
            conn.execute(text(
                f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_name} {col_def}"
            ))
        conn.commit()
