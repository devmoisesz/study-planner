import { BadRequestException, PipeTransform } from "@nestjs/common";
import { z } from "zod";

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
    constructor(private readonly schema: z.ZodType<T>) {}

    transform(value: unknown): T {
        const result = this.schema.safeParse(value);

        if (!result.success) {
            throw new BadRequestException({
                message: "Validation failed",
                errors: result.error.issues
            });
        }

        return result.data;
    }
}
