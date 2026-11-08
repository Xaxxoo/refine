import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";
import { extname } from "path";
import { User } from "../users/entities/user.entity";
import { UserPhoto } from "./entities/user-photo.entity";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPhoto]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: diskStorage({
          destination: config.get<string>("upload.dir") || "uploads",
          filename: (_req, file, cb) => {
            const ext = extname(file.originalname).toLowerCase();
            cb(null, `${randomUUID()}${ext}`);
          },
        }),
        fileFilter: (_req: any, file: any, cb: any) => {
          if (ALLOWED_MIMES.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"), false);
          }
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
