import { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Loader2, AlertCircle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFECCandidates, FECCandidate, FECPagination } from '../../../api/fec';
import { useAuth } from '../../context/AuthContext';

// ── Party helpers ────────────────────────────────────────────────────────────

function partyDot(party?: string) {
  const p = (party ?? '').toUpperCase();
  if (p === 'DEM' || p.includes('DEMOCRAT')) return 'bg-blue-500';
  if (p === 'REP' || p.includes('REPUBLICAN')) return 'bg-red-500';
  if (p === 'IND' || p.includes('INDEPENDENT') || p.includes('NONPARTISAN')) return 'bg-gray-400';
  return 'bg-purple-400';
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ── Candidate card ───────────────────────────────────────────────────────────

function FECCandidateCard({ candidate }: { candidate: FECCandidate }) {
  const officeLabel = candidate.district
    ? `${candidate.office_full} — ${candidate.state} District ${candidate.district}`
    : `${candidate.office_full}${candidate.state ? ` — ${candidate.state}` : ''}`;

  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-base font-semibold">{initials(candidate.name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold truncate">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{officeLabel}</p>
              </div>
              <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${partyDot(candidate.party)}`} />
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {candidate.party_full && (
                <p className="text-xs text-muted-foreground">{candidate.party_full}</p>
              )}
              {candidate.incumbent_challenge_full && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {candidate.incumbent_challenge_full}
                </span>
              )}
            </div>
          </div>
        </div>
        <a
          href={candidate.fec_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold flex items-center justify-center gap-2"
        >
          View FEC Profile <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

// ── Office filter tabs ───────────────────────────────────────────────────────

type OfficeFilter = '' | 'H' | 'S' | 'P';

const OFFICE_TABS: { value: OfficeFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'S', label: 'Senate' },
  { value: 'H', label: 'House' },
  { value: 'P', label: 'President' },
];

// ── Pagination controls ──────────────────────────────────────────────────────

function Pagination({
  pagination,
  onPage,
}: {
  pagination: FECPagination;
  onPage: (p: number) => void;
}) {
  const { page, pages, count } = pagination;
  if (pages <= 1) return null;

  const start = (page - 1) * pagination.per_page + 1;
  const end = Math.min(page * pagination.per_page, count);

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-muted-foreground">
        {start}–{end} of {count.toLocaleString()} candidates
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium px-2">
          {page} / {pages}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────

function FECCandidatesSection() {
  const { user } = useAuth();
  const [zipInput, setZipInput] = useState(user?.zip_code ?? '');
  const [searchZip, setSearchZip] = useState(user?.zip_code ?? '');
  const [office, setOffice] = useState<OfficeFilter>('');
  const [page, setPage] = useState(1);

  const [candidates, setCandidates] = useState<FECCandidate[]>([]);
  const [pagination, setPagination] = useState<FECPagination | null>(null);
  const [stateCode, setStateCode] = useState<string | undefined>();
  const [districtNum, setDistrictNum] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCandidates = useCallback((zip: string, off: OfficeFilter, pg: number) => {
    if (!zip) return;
    setLoading(true);
    setError('');
    getFECCandidates(zip, off || undefined, pg)
      .then((res) => {
        setCandidates(res.candidates);
        setPagination(res.pagination);
        setStateCode(res.state);
        setDistrictNum(res.district);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCandidates(searchZip, office, page);
  }, [searchZip, office, page, fetchCandidates]);

  const handleSearch = () => {
    const zip = zipInput.trim();
    if (!zip) return;
    setPage(1);
    setSearchZip(zip);
  };

  const handleOffice = (off: OfficeFilter) => {
    setOffice(off);
    setPage(1);
  };

  const handlePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-header)' }}>
          2026 Federal Candidates
          {stateCode && districtNum ? ` — ${stateCode}-${districtNum}` : stateCode ? ` — ${stateCode}` : ''}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {stateCode && districtNum
          ? `Showing House candidates for ${stateCode} District ${districtNum} and all ${stateCode} Senate candidates.`
          : stateCode
          ? `Showing 2026 FEC-registered candidates for ${stateCode}.`
          : 'FEC-registered candidates running in the 2026 election cycle.'}
      </p>

      {/* ZIP search */}
      <div className="flex gap-2 mb-4 max-w-xs">
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

      {/* Office filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {OFFICE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleOffice(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              office === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-3 rounded-xl bg-destructive/10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-4 animate-pulse">
              <div className="flex gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && !error && candidates.length === 0 && searchZip && (
        <p className="text-sm text-muted-foreground">No candidates found for this ZIP code.</p>
      )}

      {!loading && candidates.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {candidates.map((c) => (
              <FECCandidateCard key={c.candidate_id} candidate={c} />
            ))}
          </div>
          {pagination && <Pagination pagination={pagination} onPage={handlePage} />}
        </>
      )}
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
              Search 2026 federal candidates by ZIP code using FEC data.
            </p>
          </div>

          <FECCandidatesSection />

        </div>
      </div>
    </div>
  );
}
