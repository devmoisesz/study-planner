interface JwtPayload {
  exp?: number;
}

export function readTokenExpiration(token: string): Date | null {
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;

    const normalized = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded)) as JwtPayload;

    return typeof payload.exp === 'number'
      ? new Date(payload.exp * 1000)
      : null;
  } catch {
    return null;
  }
}

export function isTokenActive(token: string | undefined): token is string {
  if (!token) return false;
  const expiration = readTokenExpiration(token);
  return expiration !== null && expiration.getTime() > Date.now();
}
