import { z } from 'zod';

export const logProductivitySchema = z.object({
  percentage: z
    .number()
    .min(0.01)
    .max(1)
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-10,
      'percentage must use increments of 0.01',
    ),
});

export type LogProductivityDto = z.infer<typeof logProductivitySchema>;
