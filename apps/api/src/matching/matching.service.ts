import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgvector = require("pgvector");
import { User } from "../users/entities/user.entity";
import { MatchExplanation } from "./entities/match-explanation.entity";
import { StructuredPreference } from "../briefs/entities/structured-preference.entity";
import { BriefsService } from "../briefs/briefs.service";
import { AiService } from "../ai/ai.service";
import { BlocksService } from "../blocks/blocks.service";
import { SwipesService } from "../swipes/swipes.service";

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

export interface CompatibleCandidate {
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  interests: string[] | null;
  overallScore: number;
  scoreBreakdown: Record<string, number>;
}

// PRD category weights
const CATEGORY_WEIGHTS: Record<string, number> = {
  relationship_intention: 0.25,
  values_lifestyle: 0.25,
  personal_preferences: 0.2,
  long_term_ambitions: 0.15,
  interests: 0.1,
  other: 0.05,
};

// Priority multipliers
const PRIORITY_MULTIPLIERS: Record<string, number> = {
  non_negotiable: 1.0,
  strong: 0.7,
  nice_to_have: 0.3,
};

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(MatchExplanation)
    private readonly explanationsRepository: Repository<MatchExplanation>,
    private readonly briefsService: BriefsService,
    private readonly aiService: AiService,
    private readonly blocksService: BlocksService,
    private readonly swipesService: SwipesService,
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

  async discoverCompatible(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<{ candidates: CompatibleCandidate[]; total: number }> {
    // Get user's active brief and preferences
    const activeBrief = await this.briefsService.getActiveBrief(userId);
    if (!activeBrief || activeBrief.processingStatus !== "completed") {
      return { candidates: [], total: 0 };
    }

    const userPreferences = await this.briefsService.getActivePreferences(userId);

    // Step 1: Hard filter - exclude blocked, swiped, inactive, self
    const blockedIds = await this.blocksService.getBlockedUserIds(userId);
    const swipedIds = await this.swipesService.getSwipedUserIds(userId);
    const excludeIds = [...new Set([...blockedIds, ...swipedIds, userId])];

    // Step 2: Semantic pre-filter with pgvector
    const briefEmbeddingRows: { brief_embedding: string }[] =
      await this.usersRepository.query(
        `SELECT "brief_embedding" FROM "partner_briefs" WHERE "id" = $1`,
        [activeBrief.id],
      );

    const briefEmbedding = briefEmbeddingRows[0]?.brief_embedding;
    if (!briefEmbedding) {
      return { candidates: [], total: 0 };
    }

    // Query candidates using cosine similarity on profile_embedding
    const preFilterLimit = 200;
    const candidateRows: {
      id: string;
      username: string;
      display_name: string;
      bio: string | null;
      interests: string[] | null;
      religion: string | null;
      relationship_intention: string | null;
      children: string | null;
      smoking: string | null;
      drinking: string | null;
      occupation: string | null;
      education: string | null;
      self_description: string | null;
      semantic_score: number;
    }[] = await this.usersRepository.query(
      `SELECT
        u."id",
        u."username",
        u."display_name",
        u."bio",
        u."interests",
        u."religion",
        u."relationship_intention",
        u."children",
        u."smoking",
        u."drinking",
        u."occupation",
        u."education",
        u."self_description",
        1 - (u."profile_embedding" <=> $1) AS semantic_score
      FROM "users" u
      WHERE u."is_active" = true
        AND u."id" != ALL($2::uuid[])
        AND u."profile_embedding" IS NOT NULL
      ORDER BY u."profile_embedding" <=> $1
      LIMIT $3`,
      [
        pgvector.toSql(pgvector.fromSql(briefEmbedding)),
        excludeIds,
        preFilterLimit,
      ],
    );

    // Step 3: Structured scoring
    const scored = candidateRows.map((candidate) => {
      const forwardScore = this.scoreCandidate(candidate, userPreferences);

      return {
        userId: candidate.id,
        username: candidate.username,
        displayName: candidate.display_name,
        bio: candidate.bio,
        interests: candidate.interests,
        overallScore: forwardScore.total,
        scoreBreakdown: forwardScore.breakdown,
      };
    });

    // Step 4: For top candidates, compute mutual scoring
    // Get each candidate's active preferences and score user against them
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return { candidates: [], total: 0 };
    }

    const userAsCandidate = {
      religion: user.religion,
      relationship_intention: user.relationshipIntention,
      children: user.children,
      smoking: user.smoking,
      drinking: user.drinking,
      occupation: user.occupation,
      education: user.education,
      interests: user.interests,
      self_description: user.selfDescription,
    };

    const mutualScored: CompatibleCandidate[] = [];
    for (const candidate of scored) {
      const candidatePrefs = await this.briefsService.getActivePreferences(candidate.userId);
      let mutualScore = candidate.overallScore;

      if (candidatePrefs.length > 0) {
        const reverseScore = this.scoreCandidate(userAsCandidate, candidatePrefs);
        mutualScore = (candidate.overallScore + reverseScore.total) / 2;
      }

      mutualScored.push({
        ...candidate,
        overallScore: Math.round(mutualScore * 100) / 100,
      });
    }

    // Sort by mutual score descending
    mutualScored.sort((a, b) => b.overallScore - a.overallScore);

    const total = mutualScored.length;
    const paginated = mutualScored.slice(offset, offset + limit);

    return { candidates: paginated, total };
  }

  async getOrGenerateExplanation(
    userId: string,
    candidateId: string,
  ): Promise<MatchExplanation> {
    // Check for existing explanation
    const existing = await this.explanationsRepository.findOne({
      where: { userId, candidateId },
    });
    if (existing) {
      return existing;
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    const candidate = await this.usersRepository.findOneBy({ id: candidateId });
    if (!user || !candidate) {
      throw new NotFoundException("User or candidate not found");
    }

    const preferences = await this.briefsService.getActivePreferences(userId);

    const userProfile = {
      bio: user.bio,
      interests: user.interests,
      religion: user.religion,
      relationshipIntention: user.relationshipIntention,
      occupation: user.occupation,
      education: user.education,
    };

    const candidateProfile = {
      bio: candidate.bio,
      interests: candidate.interests,
      religion: candidate.religion,
      relationshipIntention: candidate.relationshipIntention,
      occupation: candidate.occupation,
      education: candidate.education,
    };

    const aiExplanation = await this.aiService.generateMatchExplanation(
      userProfile,
      candidateProfile,
      preferences,
    );

    // Compute score for storage
    const candidateRow = {
      religion: candidate.religion,
      relationship_intention: candidate.relationshipIntention,
      children: candidate.children,
      smoking: candidate.smoking,
      drinking: candidate.drinking,
      occupation: candidate.occupation,
      education: candidate.education,
      interests: candidate.interests,
      self_description: candidate.selfDescription,
    };
    const score = this.scoreCandidate(candidateRow, preferences);

    const explanation = this.explanationsRepository.create({
      userId,
      candidateId,
      overallScore: Math.round(score.total * 100) / 100,
      scoreBreakdown: score.breakdown,
      strengths: aiExplanation.strengths,
      differences: aiExplanation.differences,
    });

    return this.explanationsRepository.save(explanation);
  }

  private scoreCandidate(
    candidate: Record<string, any>,
    preferences: StructuredPreference[],
  ): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    const categoryMaxScores: Record<string, number> = {};

    for (const pref of preferences) {
      const weight = CATEGORY_WEIGHTS[pref.category] ?? 0.05;
      const priorityMult = PRIORITY_MULTIPLIERS[pref.priority] ?? 0.3;

      const match = this.doesCandidateMatchPreference(candidate, pref);
      const prefScore = match * weight * priorityMult;

      breakdown[pref.category] = (breakdown[pref.category] ?? 0) + prefScore;
      categoryMaxScores[pref.category] =
        (categoryMaxScores[pref.category] ?? 0) + weight * priorityMult;
    }

    // Normalize category scores to 0-1 range
    let total = 0;
    let maxPossible = 0;
    for (const cat of Object.keys(breakdown)) {
      total += breakdown[cat];
      maxPossible += categoryMaxScores[cat];
      // Normalize breakdown for display
      if (categoryMaxScores[cat] > 0) {
        breakdown[cat] =
          Math.round((breakdown[cat] / categoryMaxScores[cat]) * 100) / 100;
      }
    }

    const normalizedTotal = maxPossible > 0 ? total / maxPossible : 0;
    return { total: normalizedTotal, breakdown };
  }

  private doesCandidateMatchPreference(
    candidate: Record<string, any>,
    pref: StructuredPreference,
  ): number {
    const normalizedVal = pref.normalizedValue.toLowerCase();
    const attribute = pref.attribute.toLowerCase();

    // Direct field matching
    const fieldMappings: Record<string, string> = {
      religion: "religion",
      faith: "religion",
      relationship_intention: "relationship_intention",
      relationship: "relationship_intention",
      children: "children",
      kids: "children",
      smoking: "smoking",
      drinking: "drinking",
      occupation: "occupation",
      job: "occupation",
      career: "occupation",
      education: "education",
    };

    const fieldName = fieldMappings[attribute];
    if (fieldName && candidate[fieldName]) {
      const candidateVal = String(candidate[fieldName]).toLowerCase();
      if (
        candidateVal === normalizedVal ||
        candidateVal.includes(normalizedVal) ||
        normalizedVal.includes(candidateVal)
      ) {
        return 1.0;
      }
      return 0.2; // Partial credit for having the field filled
    }

    // Check interests
    if (candidate.interests && Array.isArray(candidate.interests)) {
      const interests = candidate.interests.map((i: string) => i.toLowerCase());
      if (interests.some((i: string) => i.includes(normalizedVal) || normalizedVal.includes(i))) {
        return 1.0;
      }
    }

    // Check self_description for keyword matches
    if (candidate.self_description) {
      const desc = String(candidate.self_description).toLowerCase();
      if (desc.includes(normalizedVal)) {
        return 0.7;
      }
    }

    return 0;
  }
}
