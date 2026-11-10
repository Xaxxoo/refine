import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgvector = require("pgvector");
import { PartnerBrief } from "./entities/partner-brief.entity";
import { StructuredPreference } from "./entities/structured-preference.entity";
import { AiService } from "../ai/ai.service";
import { CreateBriefDto } from "./dto/create-brief.dto";
import { UpdateBriefDto } from "./dto/update-brief.dto";

@Injectable()
export class BriefsService {
  private readonly logger = new Logger(BriefsService.name);

  constructor(
    @InjectRepository(PartnerBrief)
    private readonly briefsRepository: Repository<PartnerBrief>,
    @InjectRepository(StructuredPreference)
    private readonly preferencesRepository: Repository<StructuredPreference>,
    private readonly aiService: AiService,
  ) {}

  async createBrief(userId: string, dto: CreateBriefDto): Promise<PartnerBrief> {
    const brief = this.briefsRepository.create({
      userId,
      rawText: dto.rawText,
      title: dto.title ?? null,
      processingStatus: "processing",
    });
    await this.briefsRepository.save(brief);

    try {
      // Extract structured preferences via AI
      const extracted = await this.aiService.extractPreferences(dto.rawText);

      const preferences = extracted.map((pref) =>
        this.preferencesRepository.create({
          briefId: brief.id,
          userId,
          attribute: pref.attribute,
          normalizedValue: pref.normalizedValue,
          originalWording: pref.originalWording,
          category: pref.category,
          priority: pref.priority,
          confidence: pref.confidence,
        }),
      );

      if (preferences.length > 0) {
        await this.preferencesRepository.save(preferences);
      }

      // Generate brief embedding
      const embedding = await this.aiService.generateEmbedding(dto.rawText);
      await this.briefsRepository.query(
        `UPDATE "partner_briefs" SET "brief_embedding" = $1, "processing_status" = 'completed' WHERE "id" = $2`,
        [pgvector.toSql(embedding), brief.id],
      );

      brief.processingStatus = "completed";
    } catch (error) {
      this.logger.error(`Failed to process brief ${brief.id}:`, error);
      brief.processingStatus = "failed";
      await this.briefsRepository.save(brief);
    }

    return this.getBrief(userId, brief.id);
  }

  async getBriefs(userId: string): Promise<PartnerBrief[]> {
    return this.briefsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async getBrief(userId: string, briefId: string): Promise<PartnerBrief> {
    const brief = await this.briefsRepository.findOne({
      where: { id: briefId, userId },
      relations: ["preferences"],
    });
    if (!brief) {
      throw new NotFoundException("Brief not found");
    }
    return brief;
  }

  async updateBrief(
    userId: string,
    briefId: string,
    dto: UpdateBriefDto,
  ): Promise<PartnerBrief> {
    const brief = await this.briefsRepository.findOne({
      where: { id: briefId, userId },
    });
    if (!brief) {
      throw new NotFoundException("Brief not found");
    }

    if (dto.title !== undefined) {
      brief.title = dto.title ?? null;
    }

    if (dto.rawText !== undefined) {
      brief.rawText = dto.rawText;
      brief.processingStatus = "processing";
      await this.briefsRepository.save(brief);

      // Remove old preferences
      await this.preferencesRepository.delete({ briefId });

      try {
        // Re-extract preferences
        const extracted = await this.aiService.extractPreferences(dto.rawText);

        const preferences = extracted.map((pref) =>
          this.preferencesRepository.create({
            briefId,
            userId,
            attribute: pref.attribute,
            normalizedValue: pref.normalizedValue,
            originalWording: pref.originalWording,
            category: pref.category,
            priority: pref.priority,
            confidence: pref.confidence,
          }),
        );

        if (preferences.length > 0) {
          await this.preferencesRepository.save(preferences);
        }

        // Re-generate brief embedding
        const embedding = await this.aiService.generateEmbedding(dto.rawText);
        await this.briefsRepository.query(
          `UPDATE "partner_briefs" SET "brief_embedding" = $1, "processing_status" = 'completed' WHERE "id" = $2`,
          [pgvector.toSql(embedding), briefId],
        );

        brief.processingStatus = "completed";
      } catch (error) {
        this.logger.error(`Failed to reprocess brief ${briefId}:`, error);
        brief.processingStatus = "failed";
        await this.briefsRepository.save(brief);
      }
    } else {
      await this.briefsRepository.save(brief);
    }

    return this.getBrief(userId, briefId);
  }

  async deleteBrief(userId: string, briefId: string): Promise<void> {
    const brief = await this.briefsRepository.findOne({
      where: { id: briefId, userId },
    });
    if (!brief) {
      throw new NotFoundException("Brief not found");
    }
    await this.briefsRepository.remove(brief);
  }

  async setActiveBrief(userId: string, briefId: string): Promise<PartnerBrief> {
    const brief = await this.briefsRepository.findOne({
      where: { id: briefId, userId },
    });
    if (!brief) {
      throw new NotFoundException("Brief not found");
    }

    // Deactivate all other briefs for this user
    await this.briefsRepository.update({ userId }, { isActive: false });

    // Activate this one
    brief.isActive = true;
    await this.briefsRepository.save(brief);

    return this.getBrief(userId, briefId);
  }

  async getActivePreferences(userId: string): Promise<StructuredPreference[]> {
    const activeBrief = await this.briefsRepository.findOne({
      where: { userId, isActive: true },
    });
    if (!activeBrief) {
      return [];
    }
    return this.preferencesRepository.find({
      where: { briefId: activeBrief.id },
    });
  }

  async getActiveBrief(userId: string): Promise<PartnerBrief | null> {
    return this.briefsRepository.findOne({
      where: { userId, isActive: true },
    });
  }
}
