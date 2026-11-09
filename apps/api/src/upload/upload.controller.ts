import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { ReorderPhotosDto } from "./dto/reorder-photos.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("users")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 1, ttl: 1000 }, medium: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 3600000 } })
  @Post(":id/avatar")
  @UseInterceptors(FileInterceptor("file"))
  uploadAvatar(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { userId: string },
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.uploadService.updateAvatar(id, user.userId, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 1, ttl: 1000 }, medium: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 3600000 } })
  @Post(":id/photos")
  @UseInterceptors(FileInterceptor("file"))
  addPhoto(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { userId: string },
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.uploadService.addPhoto(id, user.userId, file.filename);
  }

  @Get(":id/photos")
  getPhotos(@Param("id") id: string) {
    return this.uploadService.getPhotos(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/photos/:photoId")
  deletePhoto(
    @Param("id") id: string,
    @Param("photoId") photoId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.uploadService.deletePhoto(id, user.userId, photoId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id/photos/reorder")
  reorderPhotos(
    @Param("id") id: string,
    @Body() dto: ReorderPhotosDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.uploadService.reorderPhotos(id, user.userId, dto.photoIds);
  }
}
