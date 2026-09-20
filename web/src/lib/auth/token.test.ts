import { describe, expect, it } from 'vitest';
import { isTokenActive, readTokenExpiration } from './token';

function tokenWithExpiration(exp: number): string {
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `header.${payload}.signature`;
}

describe('JWT session helpers', () => {
  it('reconhece um token ainda ativo', () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    expect(isTokenActive(tokenWithExpiration(exp))).toBe(true);
    expect(readTokenExpiration(tokenWithExpiration(exp))?.getTime()).toBe(
      exp * 1000,
    );
  });

  it('rejeita token expirado ou malformado', () => {
    expect(isTokenActive(tokenWithExpiration(1))).toBe(false);
    expect(isTokenActive('invalid-token')).toBe(false);
  });
});
