from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, Base, SessionLocal
from app.auth.router import router as auth_router
from app.candidates.router import router as candidates_router
from app.leaderboard.router import router as leaderboard_router
from app.elections.router import router as elections_router
from app.verify.router import router as verify_router
from app.civic.router import router as civic_router
from app.seed import seed_db
from app.migrations import run_migrations


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    run_migrations(engine)
    db: Session = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Votr API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(candidates_router)
app.include_router(leaderboard_router)
app.include_router(elections_router)
app.include_router(verify_router)
app.include_router(civic_router)
