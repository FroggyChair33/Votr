import { Share2, Edit, Award, Calendar, CheckCircle, X, Upload, Camera } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState } from 'react';

export function ProfileTab() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Rivera',
    university: 'University of Georgia',
    email: 'alex.rivera@uga.edu',
    bio: 'Passionate about civic engagement and making a difference!',
    graduationYear: '2026',
    major: 'Political Science',
    profileImage: 'https://images.unsplash.com/photo-1655977237812-ee6beb137203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDcwMTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className="relative flex-shrink-0">
          <ImageWithFallback
            src={profileData.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-accent rounded-full flex items-center justify-center border-2 border-background">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            {profileData.name}
          </h1>
          <p className="text-muted-foreground text-lg mb-4">{profileData.university}</p>
          
          {/* Action Buttons - Inline on desktop */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="py-3 px-6 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Edit className="w-5 h-5" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>Edit Profile</span>
            </button>
            <button className="py-3 px-6 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              <Share2 className="w-5 h-5" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-card border border-border text-center">
          <div className="flex justify-center mb-2">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <p className="text-4xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            8
          </p>
          <p className="text-sm text-muted-foreground">Votes Cast</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border text-center">
          <div className="flex justify-center mb-2">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <p className="text-4xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            2022
          </p>
          <p className="text-sm text-muted-foreground">Year Joined</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <p className="text-4xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            3
          </p>
          <p className="text-sm text-muted-foreground">Badges Earned</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border text-center">
          <div className="flex justify-center mb-2">
            <Award className="w-8 h-8 text-accent" />
          </div>
          <p className="text-4xl mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            87%
          </p>
          <p className="text-sm text-muted-foreground">Participation</p>
        </div>
      </div>

      {/* I Voted Badges */}
      <div>
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
          My Badges
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <VoteBadge year="2024" />
          <VoteBadge year="2023" />
          <VoteBadge year="2022" />
          <VoteBadge year="2026" locked />
          <VoteBadge year="2027" locked />
          <VoteBadge year="2028" locked />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profileData={profileData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedData) => {
            setProfileData(updatedData);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function VoteBadge({ year, locked = false }: { year: string; locked?: boolean }) {
  return (
    <div
      className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 ${
        locked ? 'bg-secondary opacity-50' : 'bg-gradient-to-br from-primary to-accent'
      }`}
    >
      <CheckCircle className={`w-8 h-8 mb-2 ${locked ? 'text-muted-foreground' : 'text-white'}`} />
      <span
        className={`text-sm ${locked ? 'text-muted-foreground' : 'text-white'}`}
        style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}
      >
        {year}
      </span>
      <span className={`text-xs ${locked ? 'text-muted-foreground' : 'text-white/90'}`}>
        {locked ? 'Locked' : 'I Voted'}
      </span>
    </div>
  );
}

function EditProfileModal({ profileData, onClose, onSave }: { profileData: any; onClose: () => void; onSave: (updatedData: any) => void }) {
  const [updatedProfileData, setUpdatedProfileData] = useState(profileData);
  const [imagePreview, setImagePreview] = useState(profileData.profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUpdatedProfileData({ ...updatedProfileData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(updatedProfileData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-header)', fontWeight: 700 }}>
            Edit Profile
          </h2>
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted" 
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <ImageWithFallback
                src={imagePreview}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-4 border-background">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <label className="cursor-pointer py-2 px-4 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              <Upload className="w-5 h-5" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={updatedProfileData.name}
                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, name: e.target.value })}
                className="py-3 px-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">University</label>
              <select
                value={updatedProfileData.university}
                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, university: e.target.value })}
                className="py-3 px-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="University of Georgia">University of Georgia</option>
                <option value="Georgia Tech">Georgia Tech</option>
                <option value="Emory University">Emory University</option>
                <option value="Georgia State University">Georgia State University</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={updatedProfileData.email}
                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, email: e.target.value })}
                className="py-3 px-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="your.email@university.edu"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              <textarea
                value={updatedProfileData.bio}
                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, bio: e.target.value })}
                className="py-3 px-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                rows={4}
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {updatedProfileData.bio?.length || 0}/200
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Graduation Year</label>
                <select
                  value={updatedProfileData.graduationYear}
                  onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, graduationYear: e.target.value })}
                  className="py-3 px-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Major</label>
                <input
                  type="text"
                  value={updatedProfileData.major}
                  onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, major: e.target.value })}
                  className="py-3 px-4 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g., Political Science"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex gap-3 justify-end">
          <button 
            className="py-3 px-6 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            onClick={handleSave}
          >
            <CheckCircle className="w-5 h-5" />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}