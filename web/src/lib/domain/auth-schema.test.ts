import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './auth-schema';

describe('auth schemas', () => {
  it('normaliza o e-mail no login', () => {
    expect(
      loginSchema.parse({
        email: '  MARIA@EXAMPLE.COM ',
        password: 'password123',
      }),
    ).toEqual({ email: 'maria@example.com', password: 'password123' });
  });

  it('exige os dados de cadastro e senha com oito caracteres', () => {
    expect(() =>
      registerSchema.parse({ name: '', email: 'invalid', password: 'short' }),
    ).toThrow();
  });
});
