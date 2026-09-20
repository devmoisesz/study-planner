import { Productivity } from '../../generated/prisma/client.js';

export interface InputProductivity {
  taskId: string;
  percentage: number;
}

export abstract class ProductivityRepository {
  abstract create(data: InputProductivity): Promise<Productivity>;
}
