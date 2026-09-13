import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "./http.module.js";
import { StorageModule } from "./storage/storage.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        StorageModule,
        HttpModule,
    ]
})
export class AppModule {}
