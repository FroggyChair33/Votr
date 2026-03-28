from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UniversityVotes
from app.schemas import UniversityVotesOut

router = APIRouter(prefix="/universities", tags=["universities"])


@router.get("", response_model=list[UniversityVotesOut])
def get_university_leaderboard(db: Session = Depends(get_db)):
    return (
        db.query(UniversityVotes)
        .order_by(UniversityVotes.vote_count.desc(), UniversityVotes.name)
        .all()
    )
