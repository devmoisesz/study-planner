import { Injectable } from "@nestjs/common";
import { ResourcesRepository } from "../repositories/resources.repository.js";

@Injectable()
export class ListResourcesService {
    constructor(
        private readonly resourcesRepository: ResourcesRepository
    ) {}

    async execute() {
        return this.resourcesRepository.listResources();
    }
}
