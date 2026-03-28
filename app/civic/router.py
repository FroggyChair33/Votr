from typing import Optional
import requests as http
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import GOOGLE_CIVIC_API_KEY
from app.database import get_db
from app.models import User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/civic", tags=["civic"])

VOTERINFO_URL = "https://www.googleapis.com/civicinfo/v2/voterinfo"
REPRESENTATIVES_URL = "https://www.googleapis.com/civicinfo/v2/representatives"


class CivicCandidate(BaseModel):
    name: str
    party: Optional[str] = None
    candidate_url: Optional[str] = None
    photo_url: Optional[str] = None


class CivicContest(BaseModel):
    office: str
    level: list[str] = []
    candidates: list[CivicCandidate]


class CivicResponse(BaseModel):
    zip_code: str
    election_name: Optional[str] = None
    election_date: Optional[str] = None
    source: str  # "voterinfo" or "representatives"
    contests: list[CivicContest]


def _parse_voterinfo(data: dict, zip_code: str) -> CivicResponse:
    election = data.get("election", {})
    contests = []
    for contest in data.get("contests", []):
        candidates = [
            CivicCandidate(
                name=c.get("name", ""),
                party=c.get("party"),
                candidate_url=c.get("candidateUrl"),
                photo_url=c.get("photoUrl"),
            )
            for c in contest.get("candidates", [])
        ]
        if candidates:
            contests.append(CivicContest(
                office=contest.get("office", contest.get("type", "Unknown")),
                level=contest.get("level", []),
                candidates=candidates,
            ))
    return CivicResponse(
        zip_code=zip_code,
        election_name=election.get("name"),
        election_date=election.get("electionDay"),
        source="voterinfo",
        contests=contests,
    )


def _parse_representatives(data: dict, zip_code: str) -> CivicResponse:
    offices = {o["name"]: o for o in data.get("offices", [])}
    officials = data.get("officials", [])

    # Build office → officials mapping via index
    contests = []
    for office_name, office in offices.items():
        indices = office.get("officialIndices", [])
        candidates = []
        for idx in indices:
            if idx < len(officials):
                o = officials[idx]
                candidates.append(CivicCandidate(
                    name=o.get("name", ""),
                    party=o.get("party"),
                    candidate_url=next(iter(o.get("urls", [])), None),
                    photo_url=o.get("photoUrl"),
                ))
        if candidates:
            contests.append(CivicContest(
                office=office_name,
                level=office.get("levels", []),
                candidates=candidates,
            ))

    return CivicResponse(
        zip_code=zip_code,
        source="representatives",
        contests=contests,
    )


@router.get("/candidates", response_model=CivicResponse)
def get_local_candidates(
    zip_code: Optional[str] = Query(None, description="ZIP code to search — defaults to your profile ZIP"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    address = zip_code or current_user.zip_code
    if not address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No ZIP code provided and none saved on your profile.",
        )

    params = {"address": address, "key": GOOGLE_CIVIC_API_KEY}

    # Try voterinfo first (candidates running in upcoming elections)
    resp = http.get(VOTERINFO_URL, params=params, timeout=10)
    if resp.status_code == 200:
        data = resp.json()
        if data.get("contests"):
            return _parse_voterinfo(data, address)

    # Fall back to current representatives for the area
    resp = http.get(REPRESENTATIVES_URL, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Google Civic API returned an error. Check the ZIP code and try again.",
        )

    return _parse_representatives(resp.json(), address)
