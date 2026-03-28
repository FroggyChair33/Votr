import { useNavigate } from 'react-router';
import { Shield, CheckCircle, Trophy, BookOpen } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b1fa3] to-[#2d0066] flex flex-col items-center justify-center px-6 py-12">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-12 h-12 text-white" />
        <h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-header)' }}>
          VotR
        </h1>
      </div>

      <p className="text-white/80 text-lg text-center mb-12 max-w-sm">
        Your civic engagement platform — vote, verify, and make your voice count.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {[
          { icon: <CheckCircle className="w-4 h-4" />, label: 'Verify Your Vote' },
          { icon: <Trophy className="w-4 h-4" />, label: 'College Leaderboard' },
          { icon: <BookOpen className="w-4 h-4" />, label: 'Candidate Info' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full"
          >
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 rounded-2xl bg-white text-[#5b1fa3] font-bold text-lg hover:bg-white/90 transition-colors"
          style={{ fontFamily: 'var(--font-header)' }}
        >
          Create Account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:bg-white/20 transition-colors"
          style={{ fontFamily: 'var(--font-header)' }}
        >
          Sign In
        </button>
      </div>

    </div>
  );
}
