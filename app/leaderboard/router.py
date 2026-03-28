from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import College, User
from app.schemas import CollegeOut

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[CollegeOut])
def get_leaderboard(db: Session = Depends(get_db)):
    colleges = db.query(College).order_by(College.rank).all()

    # Recalculate live participation from user data per college
    for college in colleges:
        total = db.query(func.count(User.id)).filter(User.university == college.name).scalar() or 0
        voted = db.query(func.count(User.id)).filter(
            User.university == college.name, User.has_voted == True
        ).scalar() or 0
        if total > 0:
            college.participation = int((voted / total) * 100)

    return colleges
