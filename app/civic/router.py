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
ELECTIONS_URL = "https://www.googleapis.com/civicinfo/v2/elections"


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


def _google_error_detail(resp: http.Response) -> str:
    try:
        msg = resp.json().get("error", {}).get("message", "")
        if msg:
            return msg
    except Exception:
        pass
    return f"Google Civic API returned HTTP {resp.status_code}."


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

    if not GOOGLE_CIVIC_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Civic API key is not configured on the server.",
        )

    # Fetch all upcoming elections, then try voterinfo for each one against this address.
    # The representatives endpoint is deprecated by Google and returns 404.
    elections_resp = http.get(ELECTIONS_URL, params={"key": GOOGLE_CIVIC_API_KEY}, timeout=10)
    if elections_resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=_google_error_detail(elections_resp),
        )

    elections = [
        e for e in elections_resp.json().get("elections", [])
        if e.get("id") != "2000"  # exclude the permanent VIP test election
    ]

    for election in elections:
        params = {"address": address, "electionId": election["id"], "key": GOOGLE_CIVIC_API_KEY}
        resp = http.get(VOTERINFO_URL, params=params, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("contests"):
                return _parse_voterinfo(data, address)
        elif resp.status_code not in (400, 404):
            # Surface hard errors (403, 429, 5xx) immediately
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=_google_error_detail(resp),
            )

    # No elections found for this address — return empty rather than erroring
    return CivicResponse(zip_code=address, source="voterinfo", contests=[])
