import { Trophy, Medal } from 'lucide-react';
import { Progress } from '../Progress';

const leaderboardData = [
  { rank: 1, college: 'University of Georgia', percentage: 87, color: '#3B82F6' },
  { rank: 2, college: 'Georgia Institute of Technology', percentage: 84, color: '#EF4444' },
  { rank: 3, college: 'Emory University', percentage: 81, color: '#10B981' },
  { rank: 4, college: 'Georgia State University', percentage: 78, color: '#F59E0B' },
  { rank: 5, college: 'Kennesaw State University', percentage: 76, color: '#A78BFA' },
  { rank: 6, college: 'Georgia Southern University', percentage: 73, color: '#EC4899' },
  { rank: 7, college: 'Mercer University', percentage: 71, color: '#14B8A6' },
  { rank: 8, college: 'Augusta University', percentage: 68, color: '#F97316' },
  { rank: 9, college: 'Valdosta State University', percentage: 65, color: '#06B6D4' },
  { rank: 10, college: 'University of West Georgia', percentage: 62, color: '#A78BFA' },
];

export function LeaderboardTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-primary/10">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            College Leaderboard
          </h1>
          <p className="text-muted-foreground">Voter participation rankings</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="grid gap-3 md:gap-4 max-w-4xl">
        {leaderboardData.map((item) => (
          <div
            key={item.rank}
            className={`p-4 md:p-5 rounded-2xl bg-card border border-border transition-all hover:shadow-lg ${
              item.rank <= 3 ? 'shadow-md' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0">
                {item.rank <= 3 ? (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.rank === 1 ? 'bg-yellow-400' :
                    item.rank === 2 ? 'bg-gray-300' :
                    'bg-orange-400'
                  }`}>
                    <Medal className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-lg" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                      {item.rank}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                    {item.college}
                  </h3>
                  <span className="text-lg md:text-xl" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage} color={item.color} />
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}