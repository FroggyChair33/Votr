import re
import json
from typing import Optional
import requests
from bs4 import BeautifulSoup
import anthropic
from app.config import ANTHROPIC_API_KEY

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


def discover_sources(politician: str, office: str, district: Optional[str] = None) -> dict:
    content = (
        f"Find highly credible sources on the US {office} candidate, {politician}."
        if district is None
        else f"Find highly credible sources on the US {office} candidate, {politician}, running for House district {district}"
    )

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        system=(
            "You are a research agent trying to find sources on US political candidates. "
            "Always return sources in this JSON format "
            "{'sources': [{'url':'...', 'type': '...', 'description': '...'}]}. "
            "Only return the JSON for sources and nothing else. "
            "The available types are: election_board, candidate_site, news, voter_guide, finance_portal"
        ),
        messages=[{"role": "user", "content": content}],
    )

    text = next(b.text for b in response.content if b.type == "text")
    clean = re.sub(r"```json|```", "", text).strip()
    for i, ch in enumerate(clean):
        if ch == "{":
            clean = clean[i:]
            break

    return json.loads(clean)


def scrape_source(url: str) -> str:
    headers = {"User-Agent": "VoterEducation/1.0 (stephen.roach1357@gmail.com)"}
    response = requests.get(url, headers=headers, timeout=10)
    response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)
    return text.encode("utf-8", errors="replace").decode("utf-8")


def summarize_content(raw_text: str, source_type: str, politician: str) -> str:
    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1000,
        system="You are a research agent summarizing information on US political candidates.",
        messages=[{
            "role": "user",
            "content": (
                f"Extract a policy platform and background summary from this {source_type} page "
                f"for the candidate {politician}. Pull out policy positions or platforms, past votes "
                f"or bill sponsorship if present, campaign finance sources and figures if present. "
                f"\nRaw content: {raw_text[:10000]}"
            ),
        }],
    )
    text_block = next((b for b in response.content if b.type == "text"), None)
    return text_block.text if text_block else ""


def process_politician(politician: str, office: str, district: Optional[str] = None) -> list[dict]:
    sources_data = discover_sources(politician, office, district)
    results = []

    for source in sources_data["sources"]:
        entry = {"url": source["url"], "type": source["type"], "description": source["description"]}
        try:
            raw = scrape_source(source["url"])
            entry["summary"] = summarize_content(raw, source["type"], politician)
        except Exception as e:
            entry["summary"] = None
            entry["error"] = str(e)
        results.append(entry)

    return results
