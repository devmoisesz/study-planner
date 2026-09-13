export interface PdfUpload {
    buffer: Buffer;
    filename: string;
}

export interface StoredFile {
    url: string;
}

/**
 * Port used by application services. Implementations may use Cloudinary,
 * local disk, or any other object storage provider.
 */
export abstract class FileStorage {
    abstract uploadPdf(file: PdfUpload): Promise<StoredFile>;
}
