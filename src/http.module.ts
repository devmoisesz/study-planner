import { Module } from "@nestjs/common";
import { ResourcesModule } from "./resources/resources.module.js";
import { TasksModule } from "./tasks/tasks.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
    imports: [TasksModule, ResourcesModule, UsersModule]
})
export class HttpModule {}
