import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ResourcesRepository } from '../repositories/resources.repository.js';
import { FileStorage } from '../../storage/file-storage.js';
import type { UploadPdfDto } from '../schemas/upload-pdf.schema.js';

export interface UploadedPdf {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class UploadPdfService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(data: UploadPdfDto, file?: UploadedPdf) {
    if (
      !file ||
      file.mimetype !== 'application/pdf' ||
      !file.buffer.subarray(0, 4).equals(Buffer.from('%PDF'))
    ) {
      throw new BadRequestException('The uploaded file must be a valid PDF.');
    }

    let storedFile;

    try {
      storedFile = await this.fileStorage.uploadPdf({
        buffer: file.buffer,
        filename: file.originalname,
      });
    } catch {
      throw new BadGatewayException(
        'The PDF storage service rejected the upload.',
      );
    }

    return this.resourcesRepository.create({
      title: data.title,
      type: 'PDF',
      url: storedFile.url,
      description: data.description,
      taskId: data.taskId,
    });
  }
}
