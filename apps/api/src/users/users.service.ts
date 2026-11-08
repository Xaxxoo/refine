import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgvector = require("pgvector");
import { User } from "./entities/user.entity";
import { UserPreferences } from "./entities/user-preferences.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePreferencesDto } from "./dto/update-preferences.dto";
import { EmbeddingService } from "../embedding/embedding.service";
import { BlocksService } from "../blocks/blocks.service";
import { SwipesService } from "../swipes/swipes.service";
import { randomUUID } from "crypto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserPreferences)
    private readonly preferencesRepository: Repository<UserPreferences>,
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

  async getPreferences(userId: string): Promise<UserPreferences> {
    let prefs = await this.preferencesRepository.findOneBy({ userId });
    if (!prefs) {
      prefs = this.preferencesRepository.create({ userId });
      await this.preferencesRepository.save(prefs);
    }
    return prefs;
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<UserPreferences> {
    let prefs = await this.preferencesRepository.findOneBy({ userId });
    if (!prefs) {
      prefs = this.preferencesRepository.create({ userId });
    }
    Object.assign(prefs, dto);
    return this.preferencesRepository.save(prefs);
  }

  async discoverUsers(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<User[]> {
    const blockedIds = await this.blocksService.getBlockedUserIds(userId);
    const swipedIds = await this.swipesService.getSwipedUserIds(userId);
    const excludeIds = [...new Set([...blockedIds, ...swipedIds, userId])];

    const prefs = await this.preferencesRepository.findOneBy({ userId });
    const currentUser = await this.usersRepository.findOneBy({ id: userId });

    const qb = this.usersRepository
      .createQueryBuilder("user")
      .where("user.isActive = true")
      .andWhere("user.id NOT IN (:...excludeIds)", { excludeIds });

    if (prefs) {
      // Age filter
      if (prefs.minAge != null) {
        qb.andWhere(
          "user.dateOfBirth <= (CURRENT_DATE - INTERVAL '1 year' * :minAge)",
          { minAge: prefs.minAge },
        );
      }
      if (prefs.maxAge != null) {
        qb.andWhere(
          "user.dateOfBirth >= (CURRENT_DATE - INTERVAL '1 year' * :maxAge)",
          { maxAge: prefs.maxAge },
        );
      }

      // Gender filter
      if (prefs.preferredGender != null) {
        qb.andWhere("user.gender = :preferredGender", {
          preferredGender: prefs.preferredGender,
        });
      }

      // Distance filter (only if current user has a location)
      if (
        prefs.maxDistanceKm != null &&
        currentUser?.latitude != null &&
        currentUser?.longitude != null
      ) {
        qb.andWhere(
          `earth_distance(
            ll_to_earth(:lat, :lng),
            ll_to_earth(user.latitude, user.longitude)
          ) <= :maxDist`,
          {
            lat: currentUser.latitude,
            lng: currentUser.longitude,
            maxDist: prefs.maxDistanceKm * 1000,
          },
        );
        // Only apply distance filter to users that have location set
        qb.andWhere("user.latitude IS NOT NULL");
        qb.andWhere("user.longitude IS NOT NULL");
      }
    }

    qb.orderBy("user.createdAt", "DESC").skip(offset).take(limit);

    return qb.getMany();
  }

  async updateLastSeen(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { lastSeenAt: new Date() });
  }

  async getOnlineStatus(
    userId: string,
  ): Promise<{ isOnline: boolean; lastSeenAt: Date | null }> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Consider "online" if last seen within 2 minutes
    const isOnline =
      user.lastSeenAt != null &&
      Date.now() - user.lastSeenAt.getTime() < 2 * 60 * 1000;

    return { isOnline, lastSeenAt: user.lastSeenAt };
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
