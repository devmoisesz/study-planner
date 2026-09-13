import { Injectable, NotFoundException } from "@nestjs/common";
import { TasksRepository } from "../repositories/tasks.repository.js";

@Injectable()
export class DeleteTaskService {
    constructor(
        private readonly tasksRepository: TasksRepository
    ) {}

    async execute(id: string): Promise<void> {
        const task = await this.tasksRepository.findById(id);

        if (!task) {
            throw new NotFoundException("Task not found");
        }

        await this.tasksRepository.delete(id);
    }
}
