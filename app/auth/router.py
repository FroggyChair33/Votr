from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, VoteVerification, UniversityVotes
from app.schemas import UserCreate, UserUpdate, UserOut
from app.auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.auth.dependencies import get_current_user
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, COOKIE_SECURE
from app.seed import generate_verification_key

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"


def _set_auth_cookies(response: Response, user_id: str) -> None:
    access_token = create_access_token({"sub": str(user_id)})
    refresh_token = create_refresh_token({"sub": str(user_id)})

    response.set_cookie(
        key=ACCESS_COOKIE,
        value=access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )


def _build_user_out(user: User, db: Session) -> dict:
    record = db.query(VoteVerification).filter(VoteVerification.user_id == user.id).first()
    data = UserOut.model_validate(user).model_dump()
    data["verification_key"] = record.verification_key if record else None
    return data


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, response: Response, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        state=payload.state,
        city=payload.city,
        zip_code=payload.zip_code,
        university=payload.university,
    )
    db.add(user)
    db.flush()

    verification = VoteVerification(
        user_id=user.id,
        verification_key=generate_verification_key(),
    )
    db.add(verification)

    # Upsert the university into university_votes so it appears on the leaderboard
    if payload.university:
        uv = db.query(UniversityVotes).filter(UniversityVotes.name == payload.university).first()
        if not uv:
            db.add(UniversityVotes(name=payload.university, vote_count=0))

    db.commit()
    db.refresh(user)

    _set_auth_cookies(response, user.id)
    return _build_user_out(user, db)


@router.post("/login", response_model=UserOut)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    _set_auth_cookies(response, user.id)
    return _build_user_out(user, db)


@router.post("/refresh", response_model=UserOut)
def refresh(
    response: Response,
    refresh_token: str = Cookie(default=None),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )
    if not refresh_token:
        raise credentials_exception

    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise credentials_exception

    user_id: str = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception

    _set_auth_cookies(response, user.id)
    return _build_user_out(user, db)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(ACCESS_COOKIE)
    response.delete_cookie(REFRESH_COOKIE)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _build_user_out(current_user, db)


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return _build_user_out(current_user, db)


@router.delete("/users", status_code=status.HTTP_204_NO_CONTENT)
def clear_users(db: Session = Depends(get_db)):
    """Delete all users and reset university vote counts. For development use."""
    db.query(VoteVerification).delete()
    db.query(User).delete()
    db.query(UniversityVotes).update({UniversityVotes.vote_count: 0})
    db.commit()
