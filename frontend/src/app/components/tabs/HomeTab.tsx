import { LeaderboardPreview } from '../LeaderboardPreview';
import { ElectionCard } from '../ElectionCard';
import { CandidateCard } from '../CandidateCard';

export function HomeTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            Welcome back, Alex
          </h1>
          <p className="text-muted-foreground mt-1">University of Georgia</p>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
          Top Colleges
        </h2>
        <LeaderboardPreview />
      </div>

      {/* Grid layout for desktop */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Elections */}
        <div>
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
            Upcoming Elections
          </h2>
          <div className="space-y-3">
            <ElectionCard
              title="2026 Midterm Elections"
              date="November 3, 2026"
              daysUntil={250}
              type="Federal"
            />
            <ElectionCard
              title="Student Government Elections"
              date="April 15, 2026"
              daysUntil={18}
              type="Campus"
            />
          </div>
        </div>

        {/* Candidate Info */}
        <div>
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
            Featured Candidates
          </h2>
          <div className="space-y-3">
            <CandidateCard
              name="Sarah Johnson"
              position="Senate Candidate"
              party="Democrat"
              imageUrl="https://images.unsplash.com/photo-1655977237812-ee6beb137203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDcwMTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080"
            />
            <CandidateCard
              name="Michael Chen"
              position="House Representative"
              party="Republican"
              imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}