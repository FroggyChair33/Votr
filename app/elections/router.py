from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Election
from app.schemas import ElectionOut

router = APIRouter(prefix="/elections", tags=["elections"])


@router.get("", response_model=list[ElectionOut])
def get_elections(db: Session = Depends(get_db)):
    return db.query(Election).order_by(Election.date).all()
