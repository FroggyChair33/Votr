import { request } from './client';

export interface UniversityVotes {
  id: number;
  name: string;
  vote_count: number;
}

export const getUniversityLeaderboard = () =>
  request<UniversityVotes[]>('GET', '/universities');
