import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
