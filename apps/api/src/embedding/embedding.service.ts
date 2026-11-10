import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiService } from "../ai/ai.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly ollamaUrl: string;
  private readonly model: string;

  constructor(
    private readonly config: ConfigService,
    private readonly aiService: AiService,
  ) {
    this.ollamaUrl = this.config.get<string>("ollama.url")!;
    this.model = this.config.get<string>("ollama.model")!;
  }

  async generateEmbedding(interests: string[]): Promise<number[]> {
    const input = interests.join(", ");
    const url = `${this.ollamaUrl}/api/embed`;

    this.logger.debug(`Generating embedding for: "${input}"`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.model, input }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Ollama embed request failed (${response.status}): ${body}`,
      );
    }

    const data = (await response.json()) as { embeddings: number[][] };
    const embedding: number[] = data.embeddings[0];

    this.logger.debug(`Generated embedding with ${embedding.length} dimensions`);
    return embedding;
  }

  async generateProfileEmbedding(user: Partial<User>): Promise<number[]> {
    const parts: string[] = [];

    if (user.selfDescription) parts.push(user.selfDescription);
    if (user.bio) parts.push(user.bio);
    if (user.interests?.length) parts.push(`Interests: ${user.interests.join(", ")}`);
    if (user.religion) parts.push(`Religion: ${user.religion}`);
    if (user.relationshipIntention) parts.push(`Looking for: ${user.relationshipIntention}`);
    if (user.education) parts.push(`Education: ${user.education}`);
    if (user.occupation) parts.push(`Career: ${user.occupation}`);
    if (user.smoking) parts.push(`Smoking: ${user.smoking}`);
    if (user.drinking) parts.push(`Drinking: ${user.drinking}`);
    if (user.children) parts.push(`Children: ${user.children}`);

    const text = parts.join(". ");
    if (!text) {
      this.logger.debug("No semantic fields to embed for profile");
      return [];
    }

    this.logger.debug(`Generating profile embedding for text: "${text.substring(0, 100)}..."`);
    return this.aiService.generateEmbedding(text);
  }
}
