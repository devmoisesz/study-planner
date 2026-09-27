import { Module } from '@nestjs/common';
import { ListResourcesController } from './controllers/list-resources.controller.js';
import { ListResourcesService } from './services/list-resources.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { PrismaResourcesRepository } from './repositories/prisma/prisma-resources.repository.js';
import { ResourcesRepository } from './repositories/resources.repository.js';
import { UploadPdfController } from './controllers/upload-pdf.controller.js';
import { UploadPdfService } from './services/upload-pdf.service.js';
import { TasksModule } from '../tasks/tasks.module.js';
import { CreateResourceController } from './controllers/create-resource.controller.js';
import { CreateResourceService } from './services/create-resource.service.js';

@Module({
  controllers: [
    ListResourcesController,
    UploadPdfController,
    CreateResourceController,
  ],
  imports: [DatabaseModule, TasksModule],
  providers: [
    ListResourcesService,
    UploadPdfService,
    CreateResourceService,
    PrismaResourcesRepository,
    {
      provide: ResourcesRepository,
      useExisting: PrismaResourcesRepository,
    },
  ],
})
export class ResourcesModule {}
