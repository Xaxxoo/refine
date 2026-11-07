import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgvector = require("pgvector");
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { EmbeddingService } from "../embedding/embedding.service";
import { BlocksService } from "../blocks/blocks.service";
import { SwipesService } from "../swipes/swipes.service";
import { randomUUID } from "crypto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly embeddingService: EmbeddingService,
    private readonly blocksService: BlocksService,
    private readonly swipesService: SwipesService,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updateInterests(userId: string, interests: string[]): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Normalize: lowercase, trim, deduplicate
    const normalized = [
      ...new Set(interests.map((i) => i.trim().toLowerCase()).filter(Boolean)),
    ];

    const embedding = await this.embeddingService.generateEmbedding(normalized);

    // Use raw SQL because TypeORM can't handle the vector type natively
    await this.usersRepository.query(
      `UPDATE "users" SET "interests" = $1, "embedding" = $2 WHERE "id" = $3`,
      [normalized, pgvector.toSql(embedding), userId],
    );

    user.interests = normalized;
    return user;
  }

  async discoverUsers(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<User[]> {
    const blockedIds = await this.blocksService.getBlockedUserIds(userId);
    const swipedIds = await this.swipesService.getSwipedUserIds(userId);
    const excludeIds = [...new Set([...blockedIds, ...swipedIds, userId])];

    const qb = this.usersRepository
      .createQueryBuilder("user")
      .where("user.isActive = true")
      .andWhere("user.id NOT IN (:...excludeIds)", { excludeIds })
      .orderBy("user.createdAt", "DESC")
      .skip(offset)
      .take(limit);

    return qb.getMany();
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const anonymized = `deleted_${randomUUID()}`;
    user.email = `${anonymized}@deleted.local`;
    user.username = anonymized;
    user.displayName = "Deleted User";
    user.bio = null;
    user.dateOfBirth = null;
    user.gender = null;
    user.avatarUrl = null;
    user.interests = null;
    user.latitude = null;
    user.longitude = null;
    user.isActive = false;

    await this.usersRepository.save(user);
  }
}
