import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgvector = require("pgvector");
import { User } from "../users/entities/user.entity";

export interface SimilarUser {
  userId: string;
  username: string;
  displayName: string;
  interests: string[];
  similarity: number;
}

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findSimilarUsers(
    userId: string,
    limit: number,
  ): Promise<SimilarUser[]> {
    // Clamp limit between 1 and 50
    const safeLimit = Math.max(1, Math.min(50, limit));

    // Fetch the requesting user's embedding via raw SQL
    const rows: { embedding: string }[] = await this.usersRepository.query(
      `SELECT "embedding" FROM "users" WHERE "id" = $1`,
      [userId],
    );

    if (rows.length === 0) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const { embedding } = rows[0];
    if (!embedding) {
      return [];
    }

    const results: {
      id: string;
      username: string;
      display_name: string;
      interests: string[];
      similarity: number;
    }[] = await this.usersRepository.query(
      `SELECT
        u."id",
        u."username",
        u."display_name",
        u."interests",
        1 - (u."embedding" <=> $1) AS similarity
      FROM "users" u
      WHERE u."id" != $2
        AND u."embedding" IS NOT NULL
      ORDER BY u."embedding" <=> $1
      LIMIT $3`,
      [pgvector.toSql(pgvector.fromSql(embedding)), userId, safeLimit],
    );

    return results.map((r) => ({
      userId: r.id,
      username: r.username,
      displayName: r.display_name,
      interests: r.interests,
      similarity: parseFloat(r.similarity as unknown as string),
    }));
  }
}
