import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';

export function UpcomingElectionsPage() {
  const navigate = useNavigate();

  return (
    <div className="py-6 md:py-8">
      {/* Page Header */}
      <div className="container mx-auto px-4 md:px-8 mb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            Upcoming Elections – Georgia 2026
          </h1>
          <p className="text-sm text-muted-foreground dark:text-white/70">
            Learn about the candidates running this year
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* External Link Button */}
          <a
            href="https://www.cbsnews.com/atlanta/news/georgia-2026-election-heres-who-will-be-on-the-ballot-during-mays-governor-senate-primaries/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <button
              className="w-full h-12 px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white rounded-xl shadow-md transition-all duration-150 flex items-center justify-between"
              style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}
            >
              <span>Upcoming Elections</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}