import { useState, useEffect } from 'react';
import { Trophy, Medal, Loader2 } from 'lucide-react';
import { Progress } from '../Progress';
import { getUniversityLeaderboard, UniversityVotes } from '../../../api/universities';
import { useAuth } from '../../context/AuthContext';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#A78BFA',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#8B5CF6',
];

export function LeaderboardTab() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UniversityVotes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUniversityLeaderboard()
      .then(setLeaderboard)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxVotes = leaderboard[0]?.vote_count ?? 1;

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
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-sm text-muted-foreground">No votes recorded yet. Be the first!</p>
      ) : (
        <div className="grid gap-3 md:gap-4 max-w-4xl">
          {leaderboard.map((item, i) => {
            const rank = i + 1;
            const color = COLORS[i % COLORS.length];
            const pct = maxVotes > 0 ? Math.round((item.vote_count / maxVotes) * 100) : 0;
            const isYours = user?.university === item.name;

            return (
              <div
                key={item.id}
                className={`p-4 md:p-5 rounded-2xl bg-card border transition-all hover:shadow-lg ${
                  isYours ? 'border-primary shadow-md' : rank <= 3 ? 'border-border shadow-md' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {rank <= 3 ? (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        rank === 1 ? 'bg-yellow-400' :
                        rank === 2 ? 'bg-gray-300' :
                        'bg-orange-400'
                      }`}>
                        <Medal className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-lg" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                          {rank}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-base md:text-lg truncate ${isYours ? 'text-primary' : ''}`} style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                        {item.name}{isYours && <span className="ml-2 text-xs font-normal text-primary opacity-80">(you)</span>}
                      </h3>
                      <span className="text-lg md:text-xl flex-shrink-0" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
                        {item.vote_count} {item.vote_count === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} color={color} />
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
