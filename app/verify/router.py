from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, VoteVerification, UniversityVotes
from app.schemas import VerifyRequest, VerifyResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/verify", tags=["verify"])


@router.post("", response_model=VerifyResponse)
def verify_vote(
    payload: VerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(VoteVerification).filter(
        VoteVerification.verification_key == payload.verification_key
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid verification key")

    if record.used:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Verification key already used")

    if str(record.user_id) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This key does not belong to your account")

    record.used = True
    current_user.has_voted = True
    current_user.vote_count += 1

    university_vote_count = None
    if current_user.university:
        uv = db.query(UniversityVotes).filter(
            UniversityVotes.name == current_user.university
        ).first()
        if uv:
            uv.vote_count += 1
            university_vote_count = uv.vote_count

    db.commit()
    db.refresh(current_user)

    return VerifyResponse(
        success=True,
        message="Vote verified successfully",
        vote_count=current_user.vote_count,
        university=current_user.university,
        university_vote_count=university_vote_count,
    )


@router.get("/my-key")
def get_my_key(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(VoteVerification).filter(
        VoteVerification.user_id == current_user.id
    ).first()
    if not record:
        return {"verification_key": None}
    return {"verification_key": record.verification_key, "used": record.used}
