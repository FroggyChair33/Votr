import { LeaderboardTab } from '../tabs/LeaderboardTab';

export function LeaderboardPage() {
  return (
    <div className="py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <LeaderboardTab />
        </div>
      </div>
    </div>
  );
}