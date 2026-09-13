import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../validation/pipes/zod-validation.pipe.js";
import { taskIdSchema } from "../schemas/task-id.schema.js";
import { logProductivitySchema, type LogProductivityDto } from "../schemas/log-productivity.schema.js";
import { IncreasePriorityService } from "../services/increase-priority.service.js";

@Controller("/tasks/:id/priority-boost")
export class IncreasePriorityController {
    constructor(private readonly increasePriorityService: IncreasePriorityService) {}

    @Post()
    @HttpCode(200)
    async execute(
        @Param("id", new ZodValidationPipe(taskIdSchema)) id: string,
        @Body(new ZodValidationPipe(logProductivitySchema)) body: LogProductivityDto
    ) {
        return this.increasePriorityService.execute(id, body.percentage);
    }
}
