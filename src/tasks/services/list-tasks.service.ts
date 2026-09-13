import { Injectable } from "@nestjs/common";
import { TasksRepository } from "../repositories/tasks.repository.js";

@Injectable()
export class ListTasksService {
    constructor(
        private readonly tasksRepository: TasksRepository
    ) {}

    async execute() {        
        return this.tasksRepository.listTasks()
    }
}
