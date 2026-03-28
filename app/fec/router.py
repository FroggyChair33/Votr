from typing import Optional, Literal
import requests as http
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import OPEN_FEC_API_KEY
from app.database import get_db
from app.models import User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/fec", tags=["fec"])

FEC_CANDIDATES_URL = "https://api.open.fec.gov/v1/candidates/"
FEC_CANDIDATE_URL  = "https://www.fec.gov/data/candidate/{candidate_id}/"

TIGERWEB_ZCTA_URL  = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/11/query"
TIGERWEB_CD_URL    = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/0/query"

_FIPS_TO_STATE: dict[str, str] = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
    "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
    "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
    "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
    "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
    "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
    "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
    "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
    "54": "WV", "55": "WI", "56": "WY",
}

# Simple in-process cache so repeated searches for the same ZIP skip the two
# round-trips to the Census TIGERweb API.
_district_cache: dict[str, tuple[Optional[str], Optional[str]]] = {}


def _zip_to_district(zip_code: str) -> tuple[Optional[str], Optional[str]]:
    """Return (district, state_abbr) for a ZIP code via Census TIGERweb.

    Makes two calls:
      1. ZCTA layer → centroid lat/lon for the ZIP
      2. 119th Congressional District layer → district at that point
    Returns (None, None) on any failure so the caller can fall back gracefully.
    """
    key = zip_code.strip()[:5]
    if key in _district_cache:
        return _district_cache[key]

    try:
        # ── Step 1: centroid of the ZIP Code Tabulation Area ──────────────────
        r1 = http.get(TIGERWEB_ZCTA_URL, params={
            "where": f"ZCTA5='{key}'",
            "outFields": "INTPTLAT,INTPTLON",
            "returnGeometry": "false",
            "f": "json",
        }, timeout=10)
        features1 = r1.json().get("features", [])
        if not features1:
            _district_cache[key] = (None, None)
            return None, None

        attrs1 = features1[0]["attributes"]
        lat = float(attrs1["INTPTLAT"])
        lon = float(attrs1["INTPTLON"])

        # ── Step 2: congressional district at that point ───────────────────────
        r2 = http.get(TIGERWEB_CD_URL, params={
            "geometry": f"{lon},{lat}",
            "geometryType": "esriGeometryPoint",
            "spatialRel": "esriSpatialRelIntersects",
            "inSR": "4326",
            "outFields": "BASENAME,STATE",
            "returnGeometry": "false",
            "f": "json",
        }, timeout=10)
        features2 = r2.json().get("features", [])
        if not features2:
            _district_cache[key] = (None, None)
            return None, None

        attrs2  = features2[0]["attributes"]
        district = attrs2.get("BASENAME")                          # e.g. "10"
        fips     = str(attrs2.get("STATE", "")).zfill(2)
        state    = _FIPS_TO_STATE.get(fips)

        _district_cache[key] = (district, state)
        return district, state

    except Exception:
        _district_cache[key] = (None, None)
        return None, None


# ── Pydantic models ──────────────────────────────────────────────────────────

class FECCandidate(BaseModel):
    candidate_id: str
    name: str
    party: Optional[str] = None
    party_full: Optional[str] = None
    office: str
    office_full: str
    state: Optional[str] = None
    district: Optional[str] = None
    incumbent_challenge_full: Optional[str] = None
    has_raised_funds: bool = False
    fec_url: str


class FECPagination(BaseModel):
    count: int
    page: int
    pages: int
    per_page: int


class FECResponse(BaseModel):
    zip_code: str
    state: Optional[str]
    district: Optional[str]
    election_year: int
    office_filter: Optional[str]
    pagination: FECPagination
    candidates: list[FECCandidate]


# ── Helpers ──────────────────────────────────────────────────────────────────

def _parse_candidate(c: dict) -> FECCandidate:
    return FECCandidate(
        candidate_id=c["candidate_id"],
        name=c.get("name", "").title(),
        party=c.get("party"),
        party_full=c.get("party_full"),
        office=c.get("office", ""),
        office_full=c.get("office_full", ""),
        state=c.get("state"),
        district=c.get("district") if c.get("district") not in (None, "00") else None,
        incumbent_challenge_full=c.get("incumbent_challenge_full"),
        has_raised_funds=c.get("has_raised_funds", False),
        fec_url=FEC_CANDIDATE_URL.format(candidate_id=c["candidate_id"]),
    )


def _fec_get(params: dict) -> list[dict]:
    """Fetch a single page from the FEC candidates endpoint."""
    resp = http.get(FEC_CANDIDATES_URL, params=params, timeout=15)
    if resp.status_code != 200:
        try:
            detail = resp.json().get("message") or ""
        except Exception:
            detail = ""
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail or f"OpenFEC API returned HTTP {resp.status_code}.",
        )
    return resp.json()


def _fec_fetch_all(base_params: dict) -> list[dict]:
    """Fetch every page from FEC and return all raw candidate dicts.

    Used when we need to merge two queries (House + Senate) before paginating.
    Congressional-district results are small (< 30), Senate results < 60,
    so fetching everything up front is fine.
    """
    results: list[dict] = []
    page = 1
    while True:
        data = _fec_get({**base_params, "page": page, "per_page": 100})
        results.extend(data.get("results", []))
        pagination = data.get("pagination", {})
        if page >= pagination.get("pages", 1):
            break
        page += 1
    return results


# ── Endpoint ─────────────────────────────────────────────────────────────────

@router.get("/candidates", response_model=FECResponse)
def get_fec_candidates(
    zip_code: Optional[str] = Query(None, description="ZIP code — defaults to your profile ZIP"),
    office: Optional[Literal["H", "S", "P"]] = Query(None, description="H=House, S=Senate, P=President"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    address = (zip_code or current_user.zip_code or "").strip()
    if not address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No ZIP code provided and none saved on your profile.",
        )
    if not OPEN_FEC_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenFEC API key is not configured on the server.",
        )

    district, state = _zip_to_district(address)

    base: dict = {"election_year": 2026, "api_key": OPEN_FEC_API_KEY, "sort": "name"}

    if office == "P":
        # Presidential — national, no geographic filter
        data = _fec_get({**base, "office": "P", "page": page, "per_page": per_page})
        raw_pagination = data.get("pagination", {})
        candidates = [_parse_candidate(c) for c in data.get("results", [])]
        return FECResponse(
            zip_code=address, state=state, district=district,
            election_year=2026, office_filter=office,
            pagination=FECPagination(
                count=raw_pagination.get("count", 0),
                page=raw_pagination.get("page", page),
                pages=raw_pagination.get("pages", 0),
                per_page=raw_pagination.get("per_page", per_page),
            ),
            candidates=candidates,
        )

    if office == "S":
        # Senate — state-wide
        params = {**base, "office": "S"}
        if state:
            params["state"] = state
        data = _fec_get({**params, "page": page, "per_page": per_page})
        raw_pagination = data.get("pagination", {})
        candidates = [_parse_candidate(c) for c in data.get("results", [])]
        return FECResponse(
            zip_code=address, state=state, district=district,
            election_year=2026, office_filter=office,
            pagination=FECPagination(
                count=raw_pagination.get("count", 0),
                page=raw_pagination.get("page", page),
                pages=raw_pagination.get("pages", 0),
                per_page=raw_pagination.get("per_page", per_page),
            ),
            candidates=candidates,
        )

    if office == "H":
        # House — district-specific when district is known, state-wide otherwise
        params = {**base, "office": "H"}
        if state:
            params["state"] = state
        if district:
            params["district"] = district
        data = _fec_get({**params, "page": page, "per_page": per_page})
        raw_pagination = data.get("pagination", {})
        candidates = [_parse_candidate(c) for c in data.get("results", [])]
        return FECResponse(
            zip_code=address, state=state, district=district,
            election_year=2026, office_filter=office,
            pagination=FECPagination(
                count=raw_pagination.get("count", 0),
                page=raw_pagination.get("page", page),
                pages=raw_pagination.get("pages", 0),
                per_page=raw_pagination.get("per_page", per_page),
            ),
            candidates=candidates,
        )

    # ── "All" view: combine House (district-specific) + Senate (state-wide) ──
    # Fetch every candidate from both queries, merge, sort, then paginate here.
    h_params = {**base, "office": "H"}
    s_params = {**base, "office": "S"}
    if state:
        h_params["state"] = state
        s_params["state"] = state
    if district:
        h_params["district"] = district

    house_raw   = _fec_fetch_all(h_params)
    senate_raw  = _fec_fetch_all(s_params)
    merged_raw  = sorted(house_raw + senate_raw, key=lambda c: c.get("name", ""))

    total = len(merged_raw)
    pages = max(1, (total + per_page - 1) // per_page)
    start = (page - 1) * per_page
    end   = start + per_page
    page_slice = merged_raw[start:end]

    candidates = [_parse_candidate(c) for c in page_slice]
    return FECResponse(
        zip_code=address, state=state, district=district,
        election_year=2026, office_filter=None,
        pagination=FECPagination(count=total, page=page, pages=pages, per_page=per_page),
        candidates=candidates,
    )
