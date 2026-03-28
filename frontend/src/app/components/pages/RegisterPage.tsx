import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { register } from '../../../api/auth';
import { useAuth } from '../../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    state: '',
    city: '',
    zip_code: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      setUser(user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (
    label: string,
    key: keyof typeof form,
    opts?: { type?: string; placeholder?: string },
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <input
        type={opts?.type ?? 'text'}
        required
        value={form[key]}
        onChange={set(key)}
        placeholder={opts?.placeholder ?? ''}
        className="py-3 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b1fa3] to-[#2d0066] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-header)' }}>VotR</span>
          </div>
          <h2 className="text-xl text-white/80">Join your campus community</h2>
        </div>

        {/* Card */}
        <div className="bg-background rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-header)' }}>Create Account</h3>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('Full Name', 'username', { placeholder: 'Alex Rivera' })}
            {field('Email', 'email', { type: 'email', placeholder: 'you@university.edu' })}

            {/* Password with toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Create a password"
                  className="w-full py-3 px-4 pr-12 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Location row */}
            <div className="grid grid-cols-2 gap-3">
              {field('City', 'city', { placeholder: 'Athens' })}
              {field('State', 'state', { placeholder: 'GA' })}
            </div>

            {field('ZIP Code', 'zip_code', { placeholder: '30601' })}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: 'var(--font-header)' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
