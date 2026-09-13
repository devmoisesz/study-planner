import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { FileStorage, type PdfUpload, type StoredFile } from "./file-storage.js";

@Injectable()
export class CloudinaryFileStorage extends FileStorage {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    async uploadPdf(file: PdfUpload): Promise<StoredFile> {
        const cloudName = this.requiredConfig("CLOUDINARY_CLOUD_NAME");
        const apiKey = this.requiredConfig("CLOUDINARY_API_KEY");
        const apiSecret = this.requiredConfig("CLOUDINARY_API_SECRET");

        cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

        const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "study-planner/pdfs",
                    use_filename: false,
                    unique_filename: true
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!result) {
                        reject(new Error("Cloudinary did not return an uploaded file."));
                        return;
                    }

                    resolve(result);
                }
            );

            stream.end(file.buffer);
        });

        return { url: uploaded.secure_url };
    }

    private requiredConfig(key: string): string {
        const value = this.configService.get<string>(key);

        if (!value) {
            throw new Error(`${key} must be defined to upload PDFs.`);
        }

        return value;
    }
}
