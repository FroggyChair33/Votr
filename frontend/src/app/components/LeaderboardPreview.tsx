import { Progress } from './Progress';

const topColleges = [
  { name: 'University of Georgia', percentage: 87, color: '#3B82F6' },
  { name: 'Georgia Institute of Technology', percentage: 84, color: '#EF4444' },
  { name: 'Emory University', percentage: 81, color: '#10B981' },
];

export function LeaderboardPreview() {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="space-y-4">
        {topColleges.map((college, index) => (
          <div key={college.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    index === 0
                      ? 'bg-yellow-400'
                      : index === 1
                      ? 'bg-gray-300'
                      : 'bg-orange-400'
                  }`}
                >
                  <span className="text-sm" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-sm" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                  {college.name}
                </h3>
              </div>
              <span className="text-base" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
                {college.percentage}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={college.percentage} color={college.color} />
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: college.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}