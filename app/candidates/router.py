from typing import Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
import asyncio

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models import User, Candidate
from app.schemas import CandidateOut
from app.candidates.agent import process_politician

router = APIRouter(prefix="/candidates", tags=["candidates"])


# --- DB-backed candidate list ---

@router.get("", response_model=list[CandidateOut])
def list_candidates(db: Session = Depends(get_db)):
    return db.query(Candidate).all()


# --- AI summary ---

class SourceSummary(BaseModel):
    url: str
    type: str
    description: str
    summary: Optional[str] = None
    error: Optional[str] = None


class CandidateSummaryResponse(BaseModel):
    politician: str
    office: str
    district: Optional[str] = None
    sources: list[SourceSummary]


@router.get("/summary", response_model=CandidateSummaryResponse)
async def get_candidate_summary(
    name: str = Query(..., description="Full name of the candidate"),
    office: str = Query(..., description="Office being sought"),
    district: Optional[str] = Query(None, description="District identifier for House races"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = await asyncio.get_event_loop().run_in_executor(
        None, process_politician, name, office, district
    )

    return CandidateSummaryResponse(
        politician=name,
        office=office,
        district=district,
        sources=[SourceSummary(**r) for r in results],
    )
