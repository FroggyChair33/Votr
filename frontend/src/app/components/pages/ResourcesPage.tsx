import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Users, Calendar, Building2, MapPin, Info } from "lucide-react";
import { HowToVoteGuide } from "../HowToVoteGuide";

const resources = [
  {
    id: 1,
    title: "Candidate Information",
    description: "Learn about all candidates running in upcoming elections",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Upcoming Elections",
    description: "View dates and details for all upcoming elections",
    icon: Calendar,
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Campus Resources",
    description: "Find resources and support on your campus",
    icon: Building2,
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Polling Stations",
    description: "Locate nearby polling stations and voting centers",
    icon: MapPin,
    color: "bg-red-500",
  },
  {
    id: 5,
    title: "How to Vote",
    description: "Step-by-step guide to voting in your area",
    icon: Info,
    color: "bg-orange-500",
  },
];

export function ResourcesPage() {
  const [showVoteGuide, setShowVoteGuide] = useState(false);

  const handleResourceClick = (resourceId: number) => {
    if (resourceId === 5) {
      // How to Vote card
      setShowVoteGuide(true);
    } else {
      console.log("Resource clicked:", resourceId);
    }
  };

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resources</h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Everything you need to make informed voting decisions
        </p>

        {/* Resources Grid */}
        <div className="space-y-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card
                key={resource.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleResourceClick(resource.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`${resource.color} rounded-xl p-3 text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                    <div className="text-primary">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <Card>
            <CardContent className="p-4 space-y-2">
              {[
                "Voter Registration",
                "Absentee Ballot Request",
                "Election Results",
                "FAQs",
              ].map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer hover:text-primary transition-colors"
                >
                  <span className="text-sm">{link}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Spacing for Nav */}
        <div className="h-4" />
      </div>

      {/* How to Vote Guide Modal */}
      {showVoteGuide && (
        <HowToVoteGuide onClose={() => setShowVoteGuide(false)} />
      )}
    </>
  );
}