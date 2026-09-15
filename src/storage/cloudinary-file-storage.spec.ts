import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfigService } from '@nestjs/config';

const cloudinaryMocks = vi.hoisted(() => ({
  config: vi.fn(),
  uploadStream: vi.fn(),
}));

vi.mock('cloudinary', () => ({
  v2: {
    config: cloudinaryMocks.config,
    uploader: { upload_stream: cloudinaryMocks.uploadStream },
  },
}));

import { CloudinaryFileStorage } from './cloudinary-file-storage.js';

describe('CloudinaryFileStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads a regular PDF as an image asset', async () => {
    cloudinaryMocks.uploadStream.mockImplementation((options, callback) => ({
      end: () =>
        callback(null, {
          secure_url: 'https://res.cloudinary.com/demo/image/upload/file.pdf',
        }),
    }));
    const configService = {
      get: vi.fn(
        (key: string) =>
          ({
            CLOUDINARY_CLOUD_NAME: 'demo',
            CLOUDINARY_API_KEY: 'key',
            CLOUDINARY_API_SECRET: 'secret',
          })[key],
      ),
    } as unknown as ConfigService;
    const storage = new CloudinaryFileStorage(configService);

    await expect(
      storage.uploadPdf({
        buffer: Buffer.from('%PDF-1.7'),
        filename: 'apostila.pdf',
      }),
    ).resolves.toEqual({
      url: 'https://res.cloudinary.com/demo/image/upload/file.pdf',
    });

    expect(cloudinaryMocks.uploadStream).toHaveBeenCalledWith(
      expect.objectContaining({
        resource_type: 'image',
        folder: 'study-planner/pdfs',
      }),
      expect.any(Function),
    );
  });
});
