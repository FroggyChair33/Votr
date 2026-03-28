import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";

export function VerifyPage() {
  const [verificationKey, setVerificationKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const handleVerify = () => {
    if (verificationKey.length > 0) {
      setIsVerified(true);
      setLocationConfirmed(true);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Verify Your Vote
        </h1>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm">
            <span className="font-semibold">Secure verification process.</span> Enter your
            unique verification key to confirm your vote and earn your digital "I Voted" badge.
          </p>
        </CardContent>
      </Card>

      {/* Verification Form */}
      {!isVerified ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Verification Key</label>
              <Input
                type="text"
                placeholder="Enter your verification key"
                value={verificationKey}
                onChange={(e) => setVerificationKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                You received this key after voting at your polling station
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Location Services</p>
                <p className="text-xs text-muted-foreground">Required for verification</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Active
              </Badge>
            </div>

            <Button onClick={handleVerify} className="w-full" disabled={!verificationKey}>
              Verify Vote
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Success State */
        <Card className="border-2 border-success">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-success mb-2">Vote Verified!</h2>
                <p className="text-sm text-muted-foreground">
                  Your vote has been successfully verified and recorded.
                </p>
              </div>
            </div>

            {/* Digital Sticker */}
            <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-white text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold">I VOTED</h3>
              <p className="text-sm opacity-90">March 28, 2026</p>
              <p className="text-xs opacity-75">University of Georgia</p>
            </div>

            {/* Location Confirmation */}
            {locationConfirmed && (
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                <MapPin className="w-5 h-5 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Location Confirmed</p>
                  <p className="text-xs text-muted-foreground">
                    Campus Polling Station, Building A
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Download Badge
              </Button>
              <Button className="flex-1">Share Achievement</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Security & Privacy</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your vote is anonymous and cannot be traced back to you</li>
            <li>• Verification confirms your vote was recorded correctly</li>
            <li>• Location data is only used for polling station verification</li>
            <li>• All data is encrypted and securely stored</li>
          </ul>
        </CardContent>
      </Card>

      {/* Bottom Spacing for Nav */}
      <div className="h-4" />
    </div>
  );
}