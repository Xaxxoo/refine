import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly ollamaUrl: string;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
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
}
