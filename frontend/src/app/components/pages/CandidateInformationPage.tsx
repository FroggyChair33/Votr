interface Candidate {
  name: string;
  office: string;
  descriptor: string;
  party: 'D' | 'R' | 'I'; // Democrat, Republican, Independent
}

const candidates: Candidate[] = [
  {
    name: 'Jon Ossoff',
    office: 'U.S. Senate',
    descriptor: 'Incumbent - Running for reelection in 2026',
    party: 'D',
  },
  {
    name: 'Mike Collins',
    office: 'U.S. Senate',
    descriptor: 'U.S. Representative running in the Republican field',
    party: 'R',
  },
  {
    name: 'Keisha Lance Bottoms',
    office: 'Governor',
    descriptor: 'Former Atlanta mayor',
    party: 'D',
  },
  {
    name: 'Jason Esteves',
    office: 'Governor',
    descriptor: 'Former state senator',
    party: 'D',
  },
  {
    name: 'Chris Carr',
    office: 'Governor',
    descriptor: 'Current Georgia Attorney General',
    party: 'R',
  },
  {
    name: 'Geoff Duncan',
    office: 'Governor',
    descriptor: 'Former Lieutenant Governor',
    party: 'R',
  },
  {
    name: 'Derrick Jackson',
    office: 'Governor',
    descriptor: 'Georgia state representative',
    party: 'D',
  },
  {
    name: 'Mike Thurmond',
    office: 'Governor',
    descriptor: 'Former DeKalb County CEO',
    party: 'D',
  },
  {
    name: 'Olujimi Brown',
    office: 'Governor',
    descriptor: 'Community leader and pastor',
    party: 'I',
  },
  {
    name: 'Shawn Harris',
    office: 'U.S. House',
    descriptor: 'Candidate in a 2026 congressional race',
    party: 'D',
  },
];

export function CandidateInformationPage() {
  return (
    <div className="py-6 md:py-8">
      {/* Page Header */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            Candidate Information – Georgia 2026
          </h1>
          <p className="text-sm text-muted-foreground dark:text-white/70">
            Learn about the candidates running this year
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          {candidates.map((candidate, index) => (
            <CandidateCard key={index} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const getPartyColor = (party: 'D' | 'R' | 'I') => {
    switch (party) {
      case 'D':
        return 'bg-blue-500';
      case 'R':
        return 'bg-red-500';
      case 'I':
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          {/* Photo Placeholder */}
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-lg" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
              {candidate.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>

          {/* Candidate Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base mb-0.5" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                  {candidate.name}
                </h3>
                <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                  {candidate.office}
                </p>
              </div>
              {/* Party Indicator */}
              <div className={`w-3 h-3 rounded-full ${getPartyColor(candidate.party)} flex-shrink-0`} />
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {candidate.descriptor}
            </p>
          </div>
        </div>

        {/* Learn More Button */}
        <button
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}