# Votr

A civic engagement web app for Georgia college students. Votr helps students find their federal candidates, verify their votes, and see how their university ranks on voter participation.

## Features

- **Candidate Information** — Search federal candidates by ZIP code, filtered to your congressional district via Census TIGERweb. Filter by All, Senate, House, or President.
- **Vote Verification** — Generate a unique 16-character verification key at sign-up. Submit it to record your vote and increment your university's count.
- **University Leaderboard** — Live rankings of universities by verified vote count.
- **Profile** — View your account info, votes cast, and year joined.
- **Resources** — Links to voting guides, registration info, and campus resources.

## Tech Stack

**Backend** — FastAPI, SQLAlchemy, PostgreSQL, python-jose (JWT auth)

**Frontend** — React, TypeScript, React Router, Tailwind CSS, shadcn/ui

**APIs** — OpenFEC API (federal candidates), Census TIGERweb (ZIP → congressional district)

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Run the API:

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `OPEN_FEC_API_KEY` | API key from [api.open.fec.gov](https://api.open.fec.gov) |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional, used for candidate summaries) |

## Project Structure

```
app/                  # FastAPI backend
  auth/               # Authentication (register, login, JWT)
  fec/                # OpenFEC candidate search + ZIP→district lookup
  verify/             # Vote verification logic
  universities/       # University leaderboard endpoint
frontend/
  src/
    api/              # API client functions
    app/
      components/     # Pages, tabs, and UI components
      context/        # Auth context
```
