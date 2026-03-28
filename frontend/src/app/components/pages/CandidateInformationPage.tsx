import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { getLocalCandidates, CivicContest, CivicCandidate } from '../../../api/civic';
import { useAuth } from '../../context/AuthContext';

// ── Georgia 2026 static candidates ──────────────────────────────────────────

interface StaticCandidate {
  name: string;
  office: string;
  descriptor: string;
  party: 'D' | 'R' | 'I';
}

const staticCandidates: StaticCandidate[] = [
  { name: 'Jon Ossoff', office: 'U.S. Senate', descriptor: 'Incumbent - Running for reelection in 2026', party: 'D' },
  { name: 'Mike Collins', office: 'U.S. Senate', descriptor: 'U.S. Representative running in the Republican field', party: 'R' },
  { name: 'Keisha Lance Bottoms', office: 'Governor', descriptor: 'Former Atlanta mayor', party: 'D' },
  { name: 'Jason Esteves', office: 'Governor', descriptor: 'Former state senator', party: 'D' },
  { name: 'Chris Carr', office: 'Governor', descriptor: 'Current Georgia Attorney General', party: 'R' },
  { name: 'Geoff Duncan', office: 'Governor', descriptor: 'Former Lieutenant Governor', party: 'R' },
  { name: 'Derrick Jackson', office: 'Governor', descriptor: 'Georgia state representative', party: 'D' },
  { name: 'Mike Thurmond', office: 'Governor', descriptor: 'Former DeKalb County CEO', party: 'D' },
  { name: 'Olujimi Brown', office: 'Governor', descriptor: 'Community leader and pastor', party: 'I' },
  { name: 'Shawn Harris', office: 'U.S. House', descriptor: 'Candidate in a 2026 congressional race', party: 'D' },
];

// ── Local candidates (Google Civic API) ─────────────────────────────────────

function partyDot(party?: string) {
  const p = (party ?? '').toLowerCase();
  if (p.includes('democrat')) return 'bg-blue-500';
  if (p.includes('republican')) return 'bg-red-500';
  if (p.includes('nonpartisan') || p.includes('independent')) return 'bg-gray-400';
  return 'bg-purple-400';
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function CivicCandidateCard({ candidate, office }: { candidate: CivicCandidate; office: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          {candidate.photo_url ? (
            <img
              src={candidate.photo_url}
              alt={candidate.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-muted"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-base font-semibold">{initials(candidate.name)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold truncate">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{office}</p>
              </div>
              <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${partyDot(candidate.party)}`} />
            </div>
            {candidate.party && (
              <p className="text-xs text-muted-foreground mt-0.5">{candidate.party}</p>
            )}
          </div>
        </div>
        {candidate.candidate_url && (
          <a
            href={candidate.candidate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold flex items-center justify-center gap-2"
          >
            Learn More <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function LocalCandidatesSection() {
  const { user } = useAuth();
  const [zipInput, setZipInput] = useState(user?.zip_code ?? '');
  const [searchZip, setSearchZip] = useState(user?.zip_code ?? '');
  const [data, setData] = useState<CivicContest[] | null>(null);
  const [electionName, setElectionName] = useState<string | undefined>();
  const [source, setSource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchZip) return;
    setLoading(true);
    setError('');
    getLocalCandidates(searchZip)
      .then((res) => {
        setData(res.contests);
        setElectionName(res.election_name);
        setSource(res.source);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchZip]);

  const handleSearch = () => {
    if (zipInput.trim()) setSearchZip(zipInput.trim());
  };

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-header)' }}>
          Candidates In Your Area
        </h2>
      </div>
      {electionName && (
        <p className="text-sm text-muted-foreground mb-4">{electionName}</p>
      )}
      {source === 'representatives' && !electionName && (
        <p className="text-sm text-muted-foreground mb-4">
          No upcoming elections found — showing current representatives for this area.
        </p>
      )}

      {/* ZIP search */}
      <div className="flex gap-2 mb-5 max-w-xs">
        <input
          type="text"
          value={zipInput}
          onChange={(e) => setZipInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter ZIP code"
          maxLength={10}
          className="flex-1 py-2.5 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !zipInput.trim()}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {/* States */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-3 rounded-xl bg-destructive/10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No candidates found for this ZIP code.</p>
      )}

      {data && data.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {data.flatMap((contest) =>
            contest.candidates.map((candidate, i) => (
              <CivicCandidateCard
                key={`${contest.office}-${i}`}
                candidate={candidate}
                office={contest.office}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Static card (Georgia 2026) ───────────────────────────────────────────────

function StaticCandidateCard({ candidate }: { candidate: StaticCandidate }) {
  const partyColor = candidate.party === 'D' ? 'bg-blue-500' : candidate.party === 'R' ? 'bg-red-500' : 'bg-gray-500';
  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-base font-semibold">{initials(candidate.name)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.office}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${partyColor} flex-shrink-0 mt-1`} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{candidate.descriptor}</p>
          </div>
        </div>
        <button className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold">
          Learn More
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function CandidateInformationPage() {
  return (
    <div className="py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
              Candidate Information
            </h1>
            <p className="text-sm text-muted-foreground">
              Find candidates running in your area and learn about Georgia 2026 races.
            </p>
          </div>

          {/* Local candidates via Google Civic API */}
          <LocalCandidatesSection />

          {/* Georgia 2026 static list */}
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-header)' }}>
              Georgia 2026 – Key Races
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {staticCandidates.map((c, i) => (
                <StaticCandidateCard key={i} candidate={c} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
