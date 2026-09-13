import { Injectable, NotFoundException } from "@nestjs/common";
import { TasksRepository } from "../repositories/tasks.repository.js";

@Injectable()
export class IncreasePriorityService {
    constructor(private readonly tasksRepository: TasksRepository) {}

    async execute(id: string, percentage: number) {
        const task = await this.tasksRepository.findById(id);

        if (!task) {
            throw new NotFoundException("Task not found");
        }

        const newScore = Math.min(100, Math.round(task.score * (1 + percentage)));
        await this.tasksRepository.changeScore(id, newScore);

        return { ...task, score: newScore };
    }
}
