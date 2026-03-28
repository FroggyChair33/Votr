import { request } from './client';

export interface MyKeyResponse {
  verification_key: string | null;
  used: boolean;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  vote_count: number;
  university?: string;
  university_vote_count?: number;
}

export const getMyKey = () => request<MyKeyResponse>('GET', '/verify/my-key');

export const verifyVote = (verification_key: string) =>
  request<VerifyResponse>('POST', '/verify', { verification_key });
