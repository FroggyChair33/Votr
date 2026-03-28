import { useNavigate } from 'react-router';
import { X, Users, Calendar, Vote, Megaphone, BookOpen, HelpCircle } from 'lucide-react';

export function CampusResourcesPage() {
  const navigate = useNavigate();

  return (
    <div className="py-6 md:py-8">
      {/* Page Header */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            Campus Resources
          </h1>
          <p className="text-sm text-muted-foreground dark:text-white/70">
            Connect with student voting organizations and campus initiatives
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          <ResourceDetailCard
            icon={<Users className="w-6 h-6" />}
            title="Student Voting Coalition"
            description="Join fellow students working to increase campus voter turnout"
            details="Meet every Tuesday at 6 PM in the Student Union. Get involved with voter registration drives, educational events, and more."
            color="bg-purple-500"
            buttonText="Join Group"
          />

          <ResourceDetailCard
            icon={<Calendar className="w-6 h-6" />}
            title="Voter Registration Events"
            description="Upcoming campus events to help you register"
            details="Weekly registration tables every Wednesday from 11 AM - 2 PM at the Main Quad. Volunteers available to help with registration and answer questions."
            color="bg-blue-500"
            buttonText="View Schedule"
          />

          <ResourceDetailCard
            icon={<Vote className="w-6 h-6" />}
            title="Campus Polling Station"
            description="Vote right here on campus"
            details="Located in the Student Recreation Center. Open from 7 AM - 8 PM on election day. Bring your student ID for faster check-in."
            color="bg-green-500"
            buttonText="Get Directions"
          />

          <ResourceDetailCard
            icon={<Megaphone className="w-6 h-6" />}
            title="Voter Education Workshops"
            description="Learn about candidates and ballot measures"
            details="Free workshops every Thursday at 5 PM covering local, state, and federal elections. Non-partisan education to help you make informed decisions."
            color="bg-orange-500"
            buttonText="Register"
          />

          <ResourceDetailCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Civic Engagement Library"
            description="Resources on democracy and civic participation"
            details="Access books, articles, and videos about voting rights, political systems, and civic engagement. Located on the 3rd floor of the main library."
            color="bg-indigo-500"
            buttonText="Browse Catalog"
          />

          <ResourceDetailCard
            icon={<HelpCircle className="w-6 h-6" />}
            title="Voting Help Desk"
            description="Get your voting questions answered"
            details="Student volunteers available Monday-Friday 10 AM - 4 PM at the Student Government office. Call or stop by for assistance with registration, absentee ballots, and more."
            color="bg-teal-500"
            buttonText="Contact Us"
          />
        </div>
      </div>
    </div>
  );
}

function ResourceDetailCard({
  icon,
  title,
  description,
  details,
  color,
  buttonText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  color: string;
  buttonText: string;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <div className={`p-3 rounded-xl ${color} text-white flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          {details}
        </p>
        <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}