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

export interface NearbyUser {
  userId: string;
  username: string;
  displayName: string;
  interests: string[];
  distanceKm: number;
  similarity: number | null;
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

  async findNearbyUsers(
    userId: string,
    radiusKm: number,
    limit: number,
  ): Promise<NearbyUser[]> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (user.latitude == null || user.longitude == null) {
      return [];
    }

    // Fetch requesting user's embedding for optional similarity score
    const embeddingRows: { embedding: string | null }[] =
      await this.usersRepository.query(
        `SELECT "embedding" FROM "users" WHERE "id" = $1`,
        [userId],
      );
    const userEmbedding = embeddingRows[0]?.embedding;

    const radiusMeters = radiusKm * 1000;

    const similaritySelect = userEmbedding
      ? `, CASE WHEN u."embedding" IS NOT NULL THEN 1 - (u."embedding" <=> $5) ELSE NULL END AS similarity`
      : `, NULL AS similarity`;

    const params: (string | number)[] = [
      user.latitude,
      user.longitude,
      radiusMeters,
      userId,
    ];

    if (userEmbedding) {
      params.push(pgvector.toSql(pgvector.fromSql(userEmbedding)));
    }

    const results: {
      id: string;
      username: string;
      display_name: string;
      interests: string[];
      distance_meters: number;
      similarity: number | null;
    }[] = await this.usersRepository.query(
      `SELECT
        u."id",
        u."username",
        u."display_name",
        u."interests",
        earth_distance(
          ll_to_earth($1::float8, $2::float8),
          ll_to_earth(u."latitude", u."longitude")
        ) AS distance_meters
        ${similaritySelect}
      FROM "users" u
      WHERE u."id" != $4
        AND u."latitude" IS NOT NULL
        AND u."longitude" IS NOT NULL
        AND earth_distance(
          ll_to_earth($1::float8, $2::float8),
          ll_to_earth(u."latitude", u."longitude")
        ) <= $3
      ORDER BY distance_meters
      LIMIT ${limit}`,
      params,
    );

    return results.map((r) => ({
      userId: r.id,
      username: r.username,
      displayName: r.display_name,
      interests: r.interests,
      distanceKm: parseFloat(
        (Number(r.distance_meters) / 1000).toFixed(2),
      ),
      similarity:
        r.similarity != null
          ? parseFloat(r.similarity as unknown as string)
          : null,
    }));
  }
}
