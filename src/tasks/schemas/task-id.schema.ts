import { z } from 'zod';

/** Os ids sao uuid (default(uuid) no schema.prisma). */
export const taskIdSchema = z.uuid();

export type TaskIdDto = z.infer<typeof taskIdSchema>;
