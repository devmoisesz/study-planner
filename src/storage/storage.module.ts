import { Global, Module } from "@nestjs/common";
import { CloudinaryFileStorage } from "./cloudinary-file-storage.js";
import { FileStorage } from "./file-storage.js";

@Global()
@Module({
    providers: [
        CloudinaryFileStorage,
        {
            provide: FileStorage,
            useExisting: CloudinaryFileStorage
        }
    ],
    exports: [FileStorage]
})
export class StorageModule {}
