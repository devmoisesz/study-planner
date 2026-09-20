import { describe, expect, it } from 'vitest';
import { createSessionSchema } from './create-session.schema.js';

describe('createSessionSchema', () => {
  it('accepts and normalizes valid credentials', () => {
    expect(
      createSessionSchema.parse({
        email: '  MARIA@EXAMPLE.COM  ',
        password: 'password123',
      }),
    ).toEqual({
      email: 'maria@example.com',
      password: 'password123',
    });
  });

  it.each([
    { email: 'invalid-email', password: 'password123' },
    { email: 'maria@example.com', password: '' },
  ])('rejects invalid credentials: %o', (input) => {
    expect(() => createSessionSchema.parse(input)).toThrow();
  });
});
