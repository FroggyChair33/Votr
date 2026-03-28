import { request } from './client';

export interface User {
  id: string;
  username: string;
  email: string;
  university?: string;
  bio?: string;
  graduation_year?: string;
  major?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  has_voted: boolean;
  vote_count: number;
  verification_key?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  state: string;
  city: string;
  zip_code: string;
  university?: string;
}

export const getMe = () => request<User>('GET', '/auth/me');

export const login = (email: string, password: string) => {
  const form = new URLSearchParams();
  form.set('username', email);
  form.set('password', password);
  return request<User>('POST', '/auth/login', form);
};

export const register = (payload: RegisterPayload) =>
  request<User>('POST', '/auth/register', payload as unknown as Record<string, unknown>);

export const logout = () => request<void>('POST', '/auth/logout');

export const clearUsers = () => request<void>('DELETE', '/auth/users');

export const updateMe = (payload: Partial<Omit<User, 'id' | 'has_voted' | 'vote_count' | 'verification_key'>>) =>
  request<User>('PATCH', '/auth/me', payload as Record<string, unknown>);
