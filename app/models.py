import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Index, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    university = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    graduation_year = Column(String, nullable=True)
    major = Column(String, nullable=True)
    has_voted = Column(Boolean, default=False, nullable=False)
    vote_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("ix_users_email", "email"),
        Index("ix_users_id", "id"),
    )


class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    participation = Column(Integer, default=0, nullable=False)
    rank = Column(Integer, nullable=False)
    party_color = Column(String, nullable=False)


class Election(Base):
    __tablename__ = "elections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)
    type = Column(String, nullable=False)


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    office = Column(String, nullable=False)
    descriptor = Column(String, nullable=True)
    party = Column(String, nullable=False)


class VoteVerification(Base):
    __tablename__ = "vote_verifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    verification_key = Column(String, nullable=False, unique=True)
    used = Column(Boolean, default=False, nullable=False)
