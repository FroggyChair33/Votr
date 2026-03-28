import secrets
from sqlalchemy.orm import Session
from app.models import College, Election, Candidate


COLLEGES = [
    {"name": "University of Georgia", "participation": 87, "rank": 1, "party_color": "#3b82f6"},
    {"name": "Georgia Institute of Technology", "participation": 84, "rank": 2, "party_color": "#ef4444"},
    {"name": "Emory University", "participation": 81, "rank": 3, "party_color": "#10B981"},
    {"name": "Georgia State University", "participation": 78, "rank": 4, "party_color": "#F59E0B"},
    {"name": "Kennesaw State University", "participation": 76, "rank": 5, "party_color": "#A78BFA"},
    {"name": "Georgia Southern University", "participation": 73, "rank": 6, "party_color": "#EC4899"},
    {"name": "Mercer University", "participation": 71, "rank": 7, "party_color": "#14B8A6"},
    {"name": "Augusta University", "participation": 68, "rank": 8, "party_color": "#F97316"},
    {"name": "Valdosta State University", "participation": 65, "rank": 9, "party_color": "#06B6D4"},
    {"name": "University of West Georgia", "participation": 62, "rank": 10, "party_color": "#A78BFA"},
]

ELECTIONS = [
    {"title": "2026 Midterm Elections", "date": "2026-11-03", "type": "Federal"},
    {"title": "Student Government Elections", "date": "2026-04-15", "type": "Campus"},
    {"title": "City Council Election", "date": "2026-05-02", "type": "Local"},
    {"title": "State Representatives", "date": "2026-06-10", "type": "State"},
]

CANDIDATES = [
    {"name": "Jon Ossoff", "office": "U.S. Senate", "descriptor": "Incumbent - Running for reelection in 2026", "party": "D"},
    {"name": "Mike Collins", "office": "U.S. Senate", "descriptor": "U.S. Representative running in the Republican field", "party": "R"},
    {"name": "Keisha Lance Bottoms", "office": "Governor", "descriptor": "Former Atlanta mayor", "party": "D"},
    {"name": "Jason Esteves", "office": "Governor", "descriptor": "Former state senator", "party": "D"},
    {"name": "Chris Carr", "office": "Governor", "descriptor": "Current Georgia Attorney General", "party": "R"},
    {"name": "Geoff Duncan", "office": "Governor", "descriptor": "Former Lieutenant Governor", "party": "R"},
    {"name": "Derrick Jackson", "office": "Governor", "descriptor": "Georgia state representative", "party": "D"},
    {"name": "Mike Thurmond", "office": "Governor", "descriptor": "Former DeKalb County CEO", "party": "D"},
    {"name": "Olujimi Brown", "office": "Governor", "descriptor": "Community leader and pastor", "party": "I"},
    {"name": "Shawn Harris", "office": "U.S. House", "descriptor": "Candidate in a 2026 congressional race", "party": "D"},
]


def seed_db(db: Session) -> None:
    if db.query(College).count() == 0:
        db.bulk_insert_mappings(College, COLLEGES)

    if db.query(Election).count() == 0:
        db.bulk_insert_mappings(Election, ELECTIONS)

    if db.query(Candidate).count() == 0:
        db.bulk_insert_mappings(Candidate, CANDIDATES)

    db.commit()


def generate_verification_key() -> str:
    # token_urlsafe(12) encodes 12 bytes as URL-safe base64 → exactly 16 characters
    return secrets.token_urlsafe(12)
