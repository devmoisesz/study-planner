import { z } from "zod";

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().transform((value) => value || null)
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
