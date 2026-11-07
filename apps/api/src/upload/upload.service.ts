import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
}
