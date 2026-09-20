import { Injectable } from '@nestjs/common';
import { ResourcesRepository } from '../repositories/resources.repository.js';

@Injectable()
export class ListResourcesService {
  constructor(private readonly resourcesRepository: ResourcesRepository) {}

  async execute(userId: string) {
    return this.resourcesRepository.listResources(userId);
  }
}
