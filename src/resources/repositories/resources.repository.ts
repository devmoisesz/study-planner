import type { Resource } from '../../generated/prisma/client.js';

export type ResourceWithTask = Resource & { taskTitle: string };

export interface CreateResourceData {
  title: string;
  type: 'PDF';
  url: string;
  description?: string;
  taskId: string;
}

export abstract class ResourcesRepository {
  abstract listResources(userId: string): Promise<Resource[]>;
  abstract create(data: CreateResourceData): Promise<Resource>;
}
