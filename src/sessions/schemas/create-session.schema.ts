import { z } from 'zod';

export const createSessionSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;
