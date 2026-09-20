import type { CreateTaskDto } from '../../schemas/create-task.schema.js';

export function calculateInitialTaskScore({
  importance,
  domain,
  urgency,
  relevance,
}: CreateTaskDto): number {
  const invertedDomain = 10 - domain;
  const weightedScore =
    importance * 0.3 + invertedDomain * 0.3 + urgency * 0.2 + relevance * 0.2;

  return Math.round(weightedScore * 10);
}
