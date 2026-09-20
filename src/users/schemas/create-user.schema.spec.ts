import { describe, expect, it } from 'vitest';
import { createUserSchema } from './create-user.schema.js';

describe('createUserSchema', () => {
  it('accepts and normalizes valid user data', () => {
    expect(
      createUserSchema.parse({
        name: '  Maria Silva  ',
        email: '  MARIA@EXAMPLE.COM  ',
        password: 'password123',
      }),
    ).toEqual({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'password123',
    });
  });

  it.each([
    { name: '', email: 'maria@example.com', password: 'password123' },
    { name: 'Maria', email: 'invalid-email', password: 'password123' },
    { name: 'Maria', email: 'maria@example.com', password: 'short' },
  ])('rejects invalid user data: %o', (input) => {
    expect(() => createUserSchema.parse(input)).toThrow();
  });
});
