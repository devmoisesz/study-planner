import { describe, expect, it, vi } from 'vitest';
import { UploadPdfService } from './upload-pdf.service.js';
import type { ResourcesRepository } from '../repositories/resources.repository.js';
import type { FileStorage } from '../../storage/file-storage.js';

describe('Upload Pdf Service', () => {
  const input = {
    taskId: '4350a9a1-5095-42ef-b9cd-c4a61f64f6f8',
    title: 'Apostila de cálculo',
    description: 'Material da primeira aula',
  };

  it('uploads a PDF through the storage port and persists its URL', async () => {
    const resourcesRepository = {
      create: vi.fn().mockResolvedValue({ id: 'resource-1' }),
    } as unknown as ResourcesRepository;
    const fileStorage = {
      uploadPdf: vi.fn().mockResolvedValue({
        url: 'https://res.cloudinary.com/demo/image/upload/file.pdf',
      }),
    } as unknown as FileStorage;
    const sut = new UploadPdfService(resourcesRepository, fileStorage);

    const result = await sut.execute(input, {
      buffer: Buffer.from('%PDF-1.7'),
      originalname: 'calculo.pdf',
      mimetype: 'application/pdf',
    });

    expect(result).toEqual({ id: 'resource-1' });
    expect(fileStorage.uploadPdf).toHaveBeenCalledWith({
      buffer: Buffer.from('%PDF-1.7'),
      filename: 'calculo.pdf',
    });
    expect(resourcesRepository.create).toHaveBeenCalledWith({
      ...input,
      type: 'PDF',
      url: 'https://res.cloudinary.com/demo/image/upload/file.pdf',
    });
  });

  it('rejects a file that is not a PDF before uploading it', async () => {
    const resourcesRepository = {
      create: vi.fn(),
    } as unknown as ResourcesRepository;
    const fileStorage = { uploadPdf: vi.fn() } as unknown as FileStorage;
    const sut = new UploadPdfService(resourcesRepository, fileStorage);

    await expect(
      sut.execute(input, {
        buffer: Buffer.from('not a PDF'),
        originalname: 'notes.txt',
        mimetype: 'text/plain',
      }),
    ).rejects.toThrow('The uploaded file must be a valid PDF.');

    expect(fileStorage.uploadPdf).not.toHaveBeenCalled();
  });

  it('reports a storage rejection as a bad gateway', async () => {
    const resourcesRepository = {
      create: vi.fn(),
    } as unknown as ResourcesRepository;
    const fileStorage = {
      uploadPdf: vi.fn().mockRejectedValue(new Error('Cloudinary 403')),
    } as unknown as FileStorage;
    const sut = new UploadPdfService(resourcesRepository, fileStorage);

    await expect(
      sut.execute(input, {
        buffer: Buffer.from('%PDF-1.7'),
        originalname: 'calculo.pdf',
        mimetype: 'application/pdf',
      }),
    ).rejects.toMatchObject({ status: 502 });

    expect(resourcesRepository.create).not.toHaveBeenCalled();
  });
});
