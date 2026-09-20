import { z } from 'zod';

const priorityCriterion = z.number().int().min(1).max(10);
const resourceSchema = z.object({
  title: z.string().trim().min(1),
  type: z.enum(['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER']),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  importance: priorityCriterion,
  domain: priorityCriterion,
  urgency: priorityCriterion,
  relevance: priorityCriterion,
  resources: z.array(resourceSchema).optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
