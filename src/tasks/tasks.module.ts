import { Module } from "@nestjs/common";
import { CreateTaskController } from "./controllers/create-task.controller.js";
import { DeleteTaskController } from "./controllers/delete-task.controller.js";
import { ListTasksController } from "./controllers/list-tasks.controller.js";
import { CreateTaskService } from "./services/create-task.service.js";
import { DeleteTaskService } from "./services/delete-task.service.js";
import { ListTasksService } from "./services/list-tasks.service.js";
import { DatabaseModule } from "../database/database.module.js";
import { PrismaTasksRepository } from "./repositories/prisma/prisma-tasks.repository.js";
import { TasksRepository } from "./repositories/tasks.repository.js";

@Module({
    controllers: [CreateTaskController, ListTasksController, DeleteTaskController],
    imports: [DatabaseModule],
    providers: [
        CreateTaskService,
        ListTasksService,
        DeleteTaskService,
        PrismaTasksRepository,
        {
            provide: TasksRepository,
            useExisting: PrismaTasksRepository
        }
    ]
})
export class TasksModule {}
