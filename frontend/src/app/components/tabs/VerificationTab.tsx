import { useState, useEffect } from 'react';
import { Shield, Copy, CheckCircle, AlertCircle, Loader2, Trophy, Trash2 } from 'lucide-react';
import { getMyKey, verifyVote, VerifyResponse } from '../../../api/verify';
import { getUniversityLeaderboard, UniversityVotes } from '../../../api/universities';
import { clearUsers } from '../../../api/auth';
import { useAuth } from '../../context/AuthContext';

export function VerificationTab() {
  const { user } = useAuth();

  // Key display
  const [myKey, setMyKey] = useState<string | null>(null);
  const [keyUsed, setKeyUsed] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [keyRevealed, setKeyRevealed] = useState(false);

  // Verification input
  const [inputKey, setInputKey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);
  const [verifyError, setVerifyError] = useState('');

  // University leaderboard
  const [leaderboard, setLeaderboard] = useState<UniversityVotes[]>([]);
  const [lbLoading, setLbLoading] = useState(true);

  // Clear users
  const [clearing, setClearing] = useState(false);
  const [clearDone, setClearDone] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  function handleGetKey() {
    setKeyLoading(true);
    setKeyRevealed(false);
    getMyKey()
      .then((res) => {
        setMyKey(res.verification_key);
        setKeyUsed(res.used);
        setKeyRevealed(true);
      })
      .catch(() => {})
      .finally(() => setKeyLoading(false));
  }

  function fetchLeaderboard() {
    setLbLoading(true);
    getUniversityLeaderboard()
      .then(setLeaderboard)
      .catch(() => {})
      .finally(() => setLbLoading(false));
  }

  function copyKey() {
    if (!myKey) return;
    navigator.clipboard.writeText(myKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  }

  async function handleVerify() {
    if (!inputKey.trim()) return;
    setVerifying(true);
    setVerifyError('');
    setVerifyResult(null);
    try {
      const res = await verifyVote(inputKey.trim());
      setVerifyResult(res);
      setKeyUsed(true);
      fetchLeaderboard();
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  }

  async function handleClearUsers() {
    if (!confirm('Delete all users and reset university vote counts?')) return;
    setClearing(true);
    try {
      await clearUsers();
      setClearDone(true);
      setLeaderboard([]);
      setTimeout(() => setClearDone(false), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to clear users');
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-primary/10">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            Verify Your Vote
          </h1>
          <p className="text-muted-foreground">Secure and anonymous verification</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">

          {/* Your Key */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-header)' }}>
              Your Verification Key
            </h3>

            {!keyRevealed ? (
              <button
                onClick={handleGetKey}
                disabled={keyLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold"
              >
                {keyLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching…</>
                  : <><Shield className="w-4 h-4" /> Get My Verification Key</>
                }
              </button>
            ) : myKey ? (
              <>
                <div className="flex items-center gap-2">
                  <code className={`flex-1 py-2 px-3 rounded-xl text-sm font-mono tracking-widest border ${keyUsed ? 'bg-muted text-muted-foreground border-border' : 'bg-secondary border-primary/30'}`}>
                    {myKey}
                  </code>
                  <button
                    onClick={copyKey}
                    title="Copy key"
                    className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    {keyCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {keyUsed && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" /> This key has already been used.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No key found for your account.</p>
            )}
          </div>

          {/* Verify Input */}
          <div className="space-y-3">
            <div>
              <label htmlFor="verification-key" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Enter Key to Verify
              </label>
              <input
                id="verification-key"
                type="text"
                value={inputKey}
                onChange={(e) => { setInputKey(e.target.value); setVerifyError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Paste your 16-character key"
                maxLength={24}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm tracking-widest"
              />
              {verifyError && (
                <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {verifyError}
                </div>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying || !inputKey.trim()}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying && <Loader2 className="w-4 h-4 animate-spin" />}
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                {verifying ? 'Verifying…' : 'Verify Vote'}
              </span>
            </button>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-2xl bg-muted/50 text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-header)' }}>How it works</p>
            <p>• Your unique 16-character key is generated at sign-up</p>
            <p>• Enter your key above to record your vote</p>
            <p>• Each key can only be used once</p>
            <p>• Your university's total vote count is updated automatically</p>
          </div>
        </div>

        {/* Right column: success state or leaderboard */}
        <div className="space-y-5">
          {verifyResult ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-6 rounded-2xl bg-accent/10 border-2 border-accent text-center">
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-3" />
                <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
                  Vote Verified!
                </h3>
                <p className="text-muted-foreground text-sm">Your vote has been securely recorded</p>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-accent text-white text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                <h2 className="text-4xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 800 }}>
                  I VOTED
                </h2>
                <p className="text-lg mb-0.5" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>2026</p>
                {verifyResult.university && (
                  <p className="text-sm opacity-90">{verifyResult.university}</p>
                )}
              </div>

              {verifyResult.university && verifyResult.university_vote_count !== undefined && (
                <div className="p-3 rounded-xl bg-card border border-border text-sm text-center text-muted-foreground">
                  <span className="font-semibold text-foreground">{verifyResult.university}</span> now has{' '}
                  <span className="font-semibold text-primary">{verifyResult.university_vote_count}</span>{' '}
                  verified vote{verifyResult.university_vote_count !== 1 ? 's' : ''}.
                </div>
              )}
            </div>
          ) : (
            /* University leaderboard */
            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="font-semibold" style={{ fontFamily: 'var(--font-header)' }}>University Votes</h3>
              </div>

              {lbLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-sm text-muted-foreground">No votes recorded yet. Be the first!</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((uni, i) => (
                    <div key={uni.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                      <span className={`text-sm font-bold w-5 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-sm truncate ${user?.university === uni.name ? 'font-semibold text-primary' : ''}`}>
                        {uni.name}
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {uni.vote_count} {uni.vote_count === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clear Users (dev tool) */}
          <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5">
            <p className="text-xs text-muted-foreground mb-3">
              <span className="font-semibold text-destructive">Dev tool:</span> Deletes all users and resets vote counts.
            </p>
            <button
              onClick={handleClearUsers}
              disabled={clearing}
              className="w-full py-2.5 px-4 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              {clearing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Clearing…</>
                : clearDone
                ? <><CheckCircle className="w-4 h-4" /> Cleared</>
                : <><Trash2 className="w-4 h-4" /> Clear All Users</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
