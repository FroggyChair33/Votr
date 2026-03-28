import { colleges, upcomingElections, candidates } from "../../data/mockData";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Medal } from "lucide-react";

export function HomePage() {
  const topColleges = colleges.slice(0, 3);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, Alex!</h1>
          <p className="text-sm text-muted-foreground">University of Georgia</p>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-accent" />
              Top Colleges
            </CardTitle>
            <span className="text-sm text-primary">View All</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {topColleges.map((college, index) => (
            <div key={college.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{index + 1}</span>
                  <span className="font-medium">{college.name}</span>
                </div>
                <span className="font-semibold">{college.participation}%</span>
              </div>
              <div className="relative">
                <Progress value={college.participation} className="h-2" />
                <div
                  className="absolute inset-0 h-2 rounded-full opacity-20"
                  style={{ backgroundColor: college.partyColor }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Elections */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Upcoming Elections</h2>
        <div className="space-y-3">
          {upcomingElections.map((election) => (
            <Card key={election.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{election.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(election.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-secondary px-2 py-1 rounded-full">
                      {election.type}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Candidate Preview */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Featured Candidates</h2>
        <div className="space-y-3">
          {candidates.slice(0, 2).map((candidate) => (
            <Card key={candidate.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: candidate.partyColor }}
                      />
                      <span className="text-xs">{candidate.party}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}