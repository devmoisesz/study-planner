import { z } from 'zod';

export const createResourceSchema = z
  .object({
    title: z.string().trim().min(1),
    type: z.enum(['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER']),
    url: z.string().url().optional(),
    description: z.string().optional(),
  })
  .strict();

export type CreateResourceDto = z.infer<typeof createResourceSchema>;
