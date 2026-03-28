import { Users, Calendar, MapPin, Book, Building2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { GeorgiaMap } from '../GeorgiaMap';
import { useState } from 'react';

export function ResourcesTab() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
          Resources
        </h1>
        <p className="text-muted-foreground">Everything you need to make informed decisions</p>
      </div>

      {/* Resource Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResourceCard
          icon={<Users className="w-6 h-6" />}
          title="Candidate Information"
          description="Learn about candidates running in your district"
          color="bg-blue-500"
          onClick={() => navigate('/candidate-information')}
        />
        <ResourceCard
          icon={<Calendar className="w-6 h-6" />}
          title="Upcoming Elections"
          description="View all federal, state, and local elections"
          color="bg-purple-500"
          onClick={() => navigate('/upcoming-elections')}
        />
        <ResourceCard
          icon={<Building2 className="w-6 h-6" />}
          title="Campus Resources"
          description="Student voting groups and campus events"
          color="bg-green-500"
          onClick={() => navigate('/campus-resources')}
        />
        <PollingStationsCard />
        <ResourceCard
          icon={<Book className="w-6 h-6" />}
          title="How to Vote Guide"
          description="Step-by-step voting instructions"
          color="bg-orange-500"
          onClick={() => navigate('/vote-guide')}
        />
      </div>

      {/* Campus News */}
      <div>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
          Campus News
        </h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          <NewsCard
            title="Voter Registration Drive"
            date="March 25, 2026"
            location="Student Union"
          />
          <NewsCard
            title="Candidate Town Hall"
            date="April 2, 2026"
            location="Main Auditorium"
          />
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="w-full p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all text-left"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
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
    </button>
  );
}

function PollingStationsCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Polling station data
  const pollingStations = [
    {
      name: "Tate Student Center",
      address: "45 Baxter St, Athens, GA 30602",
      hours: "7:00 AM - 7:00 PM",
      region: "North Georgia"
    },
    {
      name: "Georgia Tech Student Center",
      address: "350 Ferst Dr NW, Atlanta, GA 30313",
      hours: "7:00 AM - 7:00 PM",
      region: "Central Georgia"
    },
    {
      name: "Emory University DUC",
      address: "605 Asbury Cir, Atlanta, GA 30322",
      hours: "7:00 AM - 7:00 PM",
      region: "Central Georgia"
    }
  ];

  return (
    <div className="w-full rounded-2xl bg-card border border-border hover:shadow-md transition-all overflow-hidden">
      {/* Header Section - Clickable to expand/collapse */}
      <button 
        className="w-full p-4 flex items-start gap-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-3 rounded-xl bg-red-500 text-white flex-shrink-0">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-base mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
            Polling Stations
          </h3>
          <p className="text-sm text-muted-foreground">Find your nearest voting location</p>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 mt-1 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {/* Map and Info Section - Collapsible */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Map */}
          <div className="h-48 bg-white dark:bg-gray-50 p-6 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <GeorgiaMap />
            </div>
          </div>
          
          {/* Polling Stations List */}
          <div className="p-4 space-y-3 bg-card">
            <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
              Campus Polling Locations
            </h4>
            {pollingStations.map((station, index) => (
              <div 
                key={index}
                className="p-3 rounded-xl bg-muted/50 border border-border/50"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-header)' }}>
                      {station.name}
                    </h5>
                    <p className="text-xs text-muted-foreground mb-1">
                      {station.address}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {station.hours}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Additional Info */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Bring a valid photo ID and your voter registration confirmation. 
                Early voting may be available at select locations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewsCard({ title, date, location }: { title: string; date: string; location: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
        {title}
      </h3>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}