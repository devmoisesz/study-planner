import { Body, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ZodValidationPipe } from "../../validation/pipes/zod-validation.pipe.js";
import { uploadPdfSchema, type UploadPdfDto } from "../schemas/upload-pdf.schema.js";
import { UploadPdfService, type UploadedPdf } from "../services/upload-pdf.service.js";

@Controller("/resources")
export class UploadPdfController {
    constructor(private readonly uploadPdfService: UploadPdfService) {}

    @Post("/pdf")
    @HttpCode(201)
    @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
    async execute(
        @Body(new ZodValidationPipe(uploadPdfSchema)) body: UploadPdfDto,
        @UploadedFile() file: UploadedPdf
    ) {
        return this.uploadPdfService.execute(body, file);
    }
}
