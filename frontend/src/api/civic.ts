import { request } from './client';

export interface CivicCandidate {
  name: string;
  party?: string;
  candidate_url?: string;
  photo_url?: string;
}

export interface CivicContest {
  office: string;
  level: string[];
  candidates: CivicCandidate[];
}

export interface CivicResponse {
  zip_code: string;
  election_name?: string;
  election_date?: string;
  source: 'voterinfo' | 'representatives';
  contests: CivicContest[];
}

export const getLocalCandidates = (zip_code?: string): Promise<CivicResponse> => {
  const query = zip_code ? `?zip_code=${encodeURIComponent(zip_code)}` : '';
  return request<CivicResponse>('GET', `/civic/candidates${query}`);
};
