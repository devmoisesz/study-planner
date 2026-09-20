import { Module } from '@nestjs/common';
import { CreateTaskController } from './controllers/create-task.controller.js';
import { DeleteTaskController } from './controllers/delete-task.controller.js';
import { ListTasksController } from './controllers/list-tasks.controller.js';
import { CreateTaskService } from './services/create-task.service.js';
import { DeleteTaskService } from './services/delete-task.service.js';
import { ListTasksService } from './services/list-tasks.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { PrismaTasksRepository } from './repositories/prisma/prisma-tasks.repository.js';
import { TasksRepository } from './repositories/tasks.repository.js';
import { ProductivityRepository } from './repositories/productivity.repository.js';
import { PrismaProductivityRepository } from './repositories/prisma/prisma-productivity.repository.js';
import { LogProductivityService } from './services/log-productivity.service.js';
import { LogProductivityController } from './controllers/log-productivity.controller.js';
import { GetTaskController } from './controllers/get-task.controller.js';
import { GetTaskService } from './services/get-task.service.js';
import { UpdateTaskController } from './controllers/update-task.controller.js';
import { UpdateTaskService } from './services/update-task.service.js';
import { IncreasePriorityController } from './controllers/increase-priority.controller.js';
import { IncreasePriorityService } from './services/increase-priority.service.js';

@Module({
  controllers: [
    CreateTaskController,
    ListTasksController,
    DeleteTaskController,
    LogProductivityController,
    GetTaskController,
    UpdateTaskController,
    IncreasePriorityController,
  ],
  imports: [DatabaseModule],
  providers: [
    CreateTaskService,
    ListTasksService,
    DeleteTaskService,
    LogProductivityService,
    GetTaskService,
    UpdateTaskService,
    IncreasePriorityService,
    PrismaTasksRepository,
    PrismaProductivityRepository,
    {
      provide: TasksRepository,
      useExisting: PrismaTasksRepository,
    },
    {
      provide: ProductivityRepository,
      useExisting: PrismaProductivityRepository,
    },
  ],
  exports: [TasksRepository],
})
export class TasksModule {}
