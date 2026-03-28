from pydantic import BaseModel, EmailStr, Field, ConfigDict
from uuid import UUID
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    state: str
    city: str
    zip_code: str
    university: Optional[str] = None


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    university: Optional[str] = None
    bio: Optional[str] = None
    graduation_year: Optional[str] = None
    major: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None


class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    state: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    university: Optional[str] = None
    bio: Optional[str] = None
    graduation_year: Optional[str] = None
    major: Optional[str] = None
    has_voted: bool = False
    vote_count: int = 0
    verification_key: Optional[str] = None

    model_config = {"from_attributes": True}


class CollegeOut(BaseModel):
    id: int
    name: str
    participation: int
    rank: int
    partyColor: str = Field(validation_alias="party_color")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ElectionOut(BaseModel):
    id: int
    title: str
    date: str
    type: str

    model_config = {"from_attributes": True}


class CandidateOut(BaseModel):
    id: int
    name: str
    office: str
    descriptor: Optional[str] = None
    party: str

    model_config = {"from_attributes": True}


class VerifyRequest(BaseModel):
    verification_key: str


class VerifyResponse(BaseModel):
    success: bool
    message: str
    vote_count: int
    university: Optional[str] = None
    university_vote_count: Optional[int] = None


class UniversityVotesOut(BaseModel):
    id: int
    name: str
    vote_count: int

    model_config = {"from_attributes": True}
