import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import { readTokenExpiration } from '@/lib/auth/token';

export async function createSession(accessToken: string): Promise<void> {
  const cookieStore = await cookies();
  const expires = readTokenExpiration(accessToken);

  cookieStore.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(expires ? { expires } : {}),
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
