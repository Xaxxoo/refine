import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgvector = require("pgvector");
import { User } from "./entities/user.entity";
import { EmbeddingService } from "../embedding/embedding.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly embeddingService: EmbeddingService,
  ) {}

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
}
