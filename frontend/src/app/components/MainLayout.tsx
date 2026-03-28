import { useState, useEffect } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router';
import { Home, Trophy, User, BookOpen, Shield } from 'lucide-react';
import { HomeTab } from './tabs/HomeTab';
import { LeaderboardTab } from './tabs/LeaderboardTab';
import { ProfileTab } from './tabs/ProfileTab';
import { ResourcesTab } from './tabs/ResourcesTab';
import { VerificationTab } from './tabs/VerificationTab';
import { ThemeToggle } from './ThemeToggle';

type TabType = 'home' | 'leaderboard' | 'profile' | 'resources' | 'verification';

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Determine if we're on a child route (not home)
  const isChildRoute = location.pathname !== '/';

  // Check if we should navigate to a specific tab based on location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab as TabType);
    }
  }, [location.state]);

  // Update active tab based on route
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('home');
    } else if (location.pathname === '/leaderboard') {
      setActiveTab('leaderboard');
    } else if (location.pathname === '/verify') {
      setActiveTab('verification');
    } else if (location.pathname === '/resources') {
      setActiveTab('resources');
    } else if (location.pathname === '/profile') {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    // Navigate to the appropriate route
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'leaderboard') {
      navigate('/leaderboard');
    } else if (tab === 'verification') {
      navigate('/verify');
    } else if (tab === 'resources') {
      navigate('/resources');
    } else if (tab === 'profile') {
      navigate('/profile');
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'profile':
        return <ProfileTab />;
      case 'resources':
        return <ResourcesTab />;
      case 'verification':
        return <VerificationTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-[#5b1fa3] dark:to-[#2d0066]" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 dark:bg-purple-950/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
              VotR
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <NavButton
              icon={<Home className="w-5 h-5" />}
              label="Home"
              active={activeTab === 'home'}
              onClick={() => handleTabClick('home')}
            />
            <NavButton
              icon={<Trophy className="w-5 h-5" />}
              label="Leaderboard"
              active={activeTab === 'leaderboard'}
              onClick={() => handleTabClick('leaderboard')}
            />
            <NavButton
              icon={<Shield className="w-5 h-5" />}
              label="Verify"
              active={activeTab === 'verification'}
              onClick={() => handleTabClick('verification')}
            />
            <NavButton
              icon={<BookOpen className="w-5 h-5" />}
              label="Resources"
              active={activeTab === 'resources'}
              onClick={() => handleTabClick('resources')}
            />
            <NavButton
              icon={<User className="w-5 h-5" />}
              label="Profile"
              active={activeTab === 'profile'}
              onClick={() => handleTabClick('profile')}
            />
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className={isChildRoute ? '' : 'container mx-auto px-4 md:px-8 py-6 md:py-8'}>
        <div className={isChildRoute ? '' : 'max-w-7xl mx-auto'}>
          {isChildRoute ? <Outlet /> : renderTab()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 dark:bg-purple-950/90 backdrop-blur-md border-t border-border z-40">
        <div className="flex justify-around items-center h-16 px-2">
          <MobileTabButton
            icon={<Home className="w-6 h-6" />}
            label="Home"
            active={activeTab === 'home'}
            onClick={() => handleTabClick('home')}
          />
          <MobileTabButton
            icon={<Trophy className="w-6 h-6" />}
            label="Board"
            active={activeTab === 'leaderboard'}
            onClick={() => handleTabClick('leaderboard')}
          />
          <MobileTabButton
            icon={<Shield className="w-6 h-6" />}
            label="Verify"
            active={activeTab === 'verification'}
            onClick={() => handleTabClick('verification')}
          />
          <MobileTabButton
            icon={<BookOpen className="w-6 h-6" />}
            label="Resources"
            active={activeTab === 'resources'}
            onClick={() => handleTabClick('resources')}
          />
          <MobileTabButton
            icon={<User className="w-6 h-6" />}
            label="Profile"
            active={activeTab === 'profile'}
            onClick={() => handleTabClick('profile')}
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'text-primary bg-primary/10' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function MobileTabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}