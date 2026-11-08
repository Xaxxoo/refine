import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UserPhoto } from "./entities/user-photo.entity";

const MAX_PHOTOS = 6;

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserPhoto)
    private readonly photosRepository: Repository<UserPhoto>,
  ) {}

  async updateAvatar(
    userId: string,
    requesterId: string,
    filename: string,
  ): Promise<User> {
    if (userId !== requesterId) {
      throw new ForbiddenException("You can only update your own avatar");
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.avatarUrl = `/uploads/${filename}`;
    return this.usersRepository.save(user);
  }

  async addPhoto(
    userId: string,
    requesterId: string,
    filename: string,
  ): Promise<UserPhoto> {
    if (userId !== requesterId) {
      throw new ForbiddenException("You can only add photos to your own profile");
    }

    const existing = await this.photosRepository.count({ where: { userId } });
    if (existing >= MAX_PHOTOS) {
      throw new BadRequestException(`Maximum of ${MAX_PHOTOS} photos allowed`);
    }

    const photo = this.photosRepository.create({
      userId,
      url: `/uploads/${filename}`,
      position: existing,
    });
    return this.photosRepository.save(photo);
  }

  async getPhotos(userId: string): Promise<UserPhoto[]> {
    return this.photosRepository.find({
      where: { userId },
      order: { position: "ASC" },
    });
  }

  async deletePhoto(
    userId: string,
    requesterId: string,
    photoId: string,
  ): Promise<{ message: string }> {
    if (userId !== requesterId) {
      throw new ForbiddenException("You can only delete your own photos");
    }

    const photo = await this.photosRepository.findOneBy({ id: photoId, userId });
    if (!photo) {
      throw new NotFoundException("Photo not found");
    }

    const deletedPosition = photo.position;
    await this.photosRepository.remove(photo);

    // Shift positions down for photos after the deleted one
    await this.photosRepository
      .createQueryBuilder()
      .update(UserPhoto)
      .set({ position: () => "position - 1" })
      .where("userId = :userId AND position > :deletedPosition", {
        userId,
        deletedPosition,
      })
      .execute();

    return { message: "Photo deleted" };
  }

  async reorderPhotos(
    userId: string,
    requesterId: string,
    photoIds: string[],
  ): Promise<UserPhoto[]> {
    if (userId !== requesterId) {
      throw new ForbiddenException("You can only reorder your own photos");
    }

    const photos = await this.photosRepository.find({ where: { userId } });

    if (photoIds.length !== photos.length) {
      throw new BadRequestException(
        "Must include all photo IDs in the new order",
      );
    }

    const photoMap = new Map(photos.map((p) => [p.id, p]));
    for (const id of photoIds) {
      if (!photoMap.has(id)) {
        throw new BadRequestException(`Photo ${id} not found`);
      }
    }

    // Temporarily set positions to negative values to avoid unique constraint violations
    for (let i = 0; i < photoIds.length; i++) {
      await this.photosRepository.update(
        { id: photoIds[i] },
        { position: -(i + 1) },
      );
    }

    // Now set final positions
    for (let i = 0; i < photoIds.length; i++) {
      await this.photosRepository.update(
        { id: photoIds[i] },
        { position: i },
      );
    }

    return this.getPhotos(userId);
  }
}
