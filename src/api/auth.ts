/**
 * Auth API — placeholder for future Telegram / phone auth.
 * These functions are NOT used in MVP landing (public access only).
 * Prepared for user cabinet phase.
 */

export interface AuthUser {
  id: string;
  name: string;
  phone?: string;
  telegramId?: string;
  avatarUrl?: string;
}

export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// TODO: POST /api/auth/telegram
export async function loginWithTelegram(
  _data: TelegramAuthData
): Promise<AuthUser | null> {
  console.warn('[Auth] Telegram login not implemented yet');
  return null;
}

// TODO: POST /api/auth/phone/request
export async function requestPhoneOtp(_phone: string): Promise<boolean> {
  console.warn('[Auth] Phone OTP not implemented yet');
  return false;
}

// TODO: POST /api/auth/phone/verify
export async function verifyPhoneOtp(
  _phone: string,
  _code: string
): Promise<AuthUser | null> {
  console.warn('[Auth] Phone OTP verify not implemented yet');
  return null;
}

// TODO: POST /api/auth/logout
export async function logout(): Promise<void> {
  console.warn('[Auth] Logout not implemented yet');
}

// TODO: GET /api/auth/me
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  return null;
}
