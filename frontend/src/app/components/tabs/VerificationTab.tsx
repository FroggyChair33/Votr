import { useState } from 'react';
import { Shield, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export function VerificationTab() {
  const [verificationKey, setVerificationKey] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (verificationKey.length < 6) {
      setError('Please enter a valid verification key');
      setVerified(false);
      return;
    }

    // Simulate verification
    setError('');
    setVerified(true);
  };

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
        <div className="space-y-6">
          {/* Location Status */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/10">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div className="ml-3">
                <h3 className="text-base mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                  Location Confirmed
                </h3>
                <p className="text-sm text-muted-foreground">University of Georgia Campus</p>
              </div>
            </div>
          </div>

          {/* Verification Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="verification-key" className="block mb-2">
                Verification Key
              </label>
              <input
                id="verification-key"
                type="text"
                value={verificationKey}
                onChange={(e) => {
                  setVerificationKey(e.target.value);
                  setError('');
                }}
                placeholder="Enter your verification key"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>Verify Vote</span>
            </button>
          </div>

          {/* Info */}
          <div className="p-4 rounded-2xl bg-muted/50">
            <h3 className="text-sm mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
              How it works
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Enter your unique verification key</li>
              <li>• Confirm your location at a polling station</li>
              <li>• Receive your digital "I Voted" sticker</li>
              <li>• Your vote remains anonymous and secure</li>
            </ul>
          </div>
        </div>

        {/* Success State */}
        <div>
          {verified && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-6 rounded-2xl bg-accent/10 border-2 border-accent text-center">
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
                  Vote Verified!
                </h3>
                <p className="text-muted-foreground">Your vote has been securely recorded</p>
              </div>

              {/* Digital Sticker */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-accent text-white text-center">
                <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                <h2 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 800 }}>
                  I VOTED
                </h2>
                <p className="text-xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                  2026
                </p>
                <p className="text-sm opacity-90">University of Georgia</p>
              </div>

              <button className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
                <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>Share Your Sticker</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}