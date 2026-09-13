import { randomUUID } from "node:crypto";
import type { CreateTaskData } from "../../factories/task.factory.js";
import { TasksRepository } from "../tasks.repository.js";
import type { CreatedTask } from "../tasks.repository.js";
import { Productivity, Task } from "../../../generated/prisma/client.js";
import { InputProductivity, ProductivityRepository } from "../productivity.repository.js";

export class ProductivityInMemory extends ProductivityRepository {
    public items: Productivity[] = [];

    async create(data: InputProductivity): Promise<Productivity> {
        const task = {
            id: randomUUID(),
            taskId: data.taskId,
            percentage: data.percentage,
            createdAt: new Date()
        }

        this.items.push(task)

        return task
    }
}
