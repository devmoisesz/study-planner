import { ResourcesRepository } from '../resources.repository.js';
import type { CreateResourceData } from '../resources.repository.js';
import type { ResourceWithTask } from '../resources.repository.js';

export class ResourcesInMemory extends ResourcesRepository {
  public items: ResourceWithTask[] = [];
  public taskOwners = new Map<string, string>();

  async listResources(userId: string): Promise<ResourceWithTask[]> {
    return [...this.items]
      .filter((resource) => this.taskOwners.get(resource.taskId) === userId)
      .sort(
        (first, second) =>
          second.createdAt.getTime() - first.createdAt.getTime(),
      );
  }

  async create(data: CreateResourceData): Promise<ResourceWithTask> {
    const resource: ResourceWithTask = {
      id: crypto.randomUUID(),
      ...data,
      description: data.description ?? null,
      createdAt: new Date(),
      taskTitle: '',
    };

    this.items.push(resource);
    return resource;
  }
}
