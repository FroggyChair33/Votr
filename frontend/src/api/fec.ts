import { request } from './client';

export interface FECCandidate {
  candidate_id: string;
  name: string;
  party?: string;
  party_full?: string;
  office: string;
  office_full: string;
  state?: string;
  district?: string;
  incumbent_challenge_full?: string;
  has_raised_funds: boolean;
  fec_url: string;
}

export interface FECPagination {
  count: number;
  page: number;
  pages: number;
  per_page: number;
}

export interface FECResponse {
  zip_code: string;
  state?: string;
  district?: string;
  election_year: number;
  office_filter?: string;
  pagination: FECPagination;
  candidates: FECCandidate[];
}

export const getFECCandidates = (
  zip_code?: string,
  office?: 'H' | 'S' | 'P',
  page = 1,
  per_page = 20,
): Promise<FECResponse> => {
  const params = new URLSearchParams();
  if (zip_code) params.set('zip_code', zip_code);
  if (office) params.set('office', office);
  params.set('page', String(page));
  params.set('per_page', String(per_page));
  return request<FECResponse>('GET', `/fec/candidates?${params}`);
};
