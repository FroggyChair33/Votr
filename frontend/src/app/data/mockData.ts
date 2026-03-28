

export interface College {
  id: number;
  name: string;
  participation: number;
  rank: number;
  partyColor: string;
}

export interface Election {
  id: number;
  title: string;
  date: string;
  type: string;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  partyColor: string;
  position: string;
  imageUrl: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const colleges: College[] = [
  { id: 1, name: "University of Georgia", participation: 87, rank: 1, partyColor: "#3b82f6" },
  { id: 2, name: "Georgia Institute of Technology", participation: 84, rank: 2, partyColor: "#ef4444" },
  { id: 3, name: "Emory University", participation: 81, rank: 3, partyColor: "#8b5cf6" },
  { id: 4, name: "Georgia State University", participation: 78, rank: 4, partyColor: "#10b981" },
  { id: 5, name: "Kennesaw State University", participation: 75, rank: 5, partyColor: "#f59e0b" },
  { id: 6, name: "Georgia Southern University", participation: 72, rank: 6, partyColor: "#ec4899" },
  { id: 7, name: "Mercer University", participation: 69, rank: 7, partyColor: "#6366f1" },
  { id: 8, name: "Augusta University", participation: 65, rank: 8, partyColor: "#14b8a6" },
];

export const upcomingElections: Election[] = [
  { id: 1, title: "Student Government President", date: "2026-04-15", type: "Campus" },
  { id: 2, title: "City Council Election", date: "2026-05-02", type: "Local" },
  { id: 3, title: "State Representatives", date: "2026-06-10", type: "State" },
];

export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    party: "Democratic Party",
    partyColor: "#3b82f6",
    position: "Student President",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    party: "Republican Party",
    partyColor: "#ef4444",
    position: "Student President",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    party: "Independent",
    partyColor: "#8b5cf6",
    position: "VP of Student Affairs",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

export const resources: Resource[] = [
  {
    id: 1,
    title: "Candidate Information",
    description: "Learn about all candidates running in upcoming elections",
    icon: "users",
  },
  {
    id: 2,
    title: "Upcoming Elections",
    description: "View dates and details for all upcoming elections",
    icon: "calendar",
  },
  {
    id: 3,
    title: "Campus Resources",
    description: "Find resources and support on your campus",
    icon: "building",
  },
  {
    id: 4,
    title: "Polling Stations",
    description: "Locate nearby polling stations and voting centers",
    icon: "map-pin",
  },
  {
    id: 5,
    title: "How to Vote",
    description: "Step-by-step guide to voting in your area",
    icon: "info",
  },
];

export const userProfile = {
  name: "Alex Martinez",
  college: "University of Georgia",
  voteCount: 12,
  yearJoined: 2024,
  hasVoted: true,
};