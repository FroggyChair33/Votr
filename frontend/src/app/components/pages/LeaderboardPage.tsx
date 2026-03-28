import { colleges } from "../../data/mockData";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { Medal, Trophy } from "lucide-react";

export function LeaderboardPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          College Leaderboard
        </h1>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm">
            <span className="font-semibold">Keep your college at the top!</span> Every vote counts
            towards your school's participation rate.
          </p>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <div className="space-y-3">
        {colleges.map((college) => {
          const isTop3 = college.rank <= 3;
          const medalColors = {
            1: "text-yellow-500",
            2: "text-gray-400",
            3: "text-amber-600",
          };

          return (
            <Card
              key={college.id}
              className={
                isTop3
                  ? "border-2 border-primary/30 shadow-lg"
                  : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {isTop3 ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Medal
                        className={`w-7 h-7 ${
                          medalColors[college.rank as keyof typeof medalColors]
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-lg font-bold text-muted-foreground">
                        {college.rank}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{college.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Participation Rate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{college.participation}%</p>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={college.participation} className="h-3" />
                  <div
                    className="absolute inset-0 h-3 rounded-full"
                    style={{
                      backgroundColor: college.partyColor,
                      width: `${college.participation}%`,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Spacing for Nav */}
      <div className="h-4" />
    </div>
  );
}