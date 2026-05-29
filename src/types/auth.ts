/**
 * Auth tipleri. Kaynak: backend auth modülü (AuthResponse / TokenPair) + DTO'lar.
 */

import type { User } from './user';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: User;
}

/** POST /auth/register gövdesi. */
export interface RegisterPayload {
  email: string;
  password: string; // 8..72 karakter
  name: string; // 2..100 karakter
  timezone?: string;
  locale?: string;
}

/** POST /auth/login gövdesi. */
export interface LoginPayload {
  email: string;
  password: string;
}
