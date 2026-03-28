import { userProfile } from "../../data/mockData";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge as BadgeIcon, Edit, Share2 } from "lucide-react";
import { Badge } from "../ui/badge";

export function ProfilePage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={userProfile.profileImage}
                alt={userProfile.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
              />
              {userProfile.hasVoted && (
                <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-full p-2">
                  <BadgeIcon className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-center">
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-sm text-muted-foreground">{userProfile.college}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 w-full justify-center py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userProfile.voteCount}</div>
                <div className="text-xs text-muted-foreground">Votes Cast</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userProfile.yearJoined}</div>
                <div className="text-xs text-muted-foreground">Year Joined</div>
              </div>
            </div>

            {/* Badges */}
            {userProfile.hasVoted && (
              <div className="w-full">
                <h3 className="text-sm font-semibold mb-2">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                    <BadgeIcon className="w-3 h-3 mr-1" />
                    I Voted 2026
                  </Badge>
                  <Badge variant="secondary">First Time Voter</Badge>
                  <Badge variant="secondary">Campus Champion</Badge>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 w-full pt-4">
              <Button className="flex-1" variant="default">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="flex-1" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voting History */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[
              { title: "Student Government Election", date: "March 15, 2026" },
              { title: "Campus Budget Referendum", date: "February 20, 2026" },
              { title: "Student Body President", date: "January 10, 2026" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Voted
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}