import { z } from 'zod';

export const uploadPdfSchema = z.object({
  taskId: z.uuid(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
});

export type UploadPdfDto = z.infer<typeof uploadPdfSchema>;
