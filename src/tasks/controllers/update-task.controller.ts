import { Body, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { ZodValidationPipe } from "../../validation/pipes/zod-validation.pipe.js";
import { taskIdSchema } from "../schemas/task-id.schema.js";
import { updateTaskSchema, type UpdateTaskDto } from "../schemas/update-task.schema.js";
import { UpdateTaskService } from "../services/update-task.service.js";

@Controller("/tasks")
export class UpdateTaskController {
    constructor(private readonly updateTaskService: UpdateTaskService) {}

    @Patch(":id")
    @HttpCode(200)
    async execute(
        @Param("id", new ZodValidationPipe(taskIdSchema)) id: string,
        @Body(new ZodValidationPipe(updateTaskSchema)) body: UpdateTaskDto
    ) {
        return this.updateTaskService.execute(id, body);
    }
}
