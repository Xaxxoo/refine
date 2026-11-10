import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractedPreference } from "./interfaces/extracted-preference.interface";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly provider: string;

  // Ollama config
  private readonly ollamaUrl: string;
  private readonly ollamaChatModel: string;
  private readonly ollamaEmbeddingModel: string;

  // OpenAI config
  private readonly openaiApiKey: string;
  private readonly openaiChatModel: string;
  private readonly openaiEmbeddingModel: string;

  constructor(private readonly config: ConfigService) {
    this.provider = this.config.get<string>("ai.provider")!;
    this.ollamaUrl = this.config.get<string>("ai.ollama.url")!;
    this.ollamaChatModel = this.config.get<string>("ai.ollama.chatModel")!;
    this.ollamaEmbeddingModel = this.config.get<string>("ai.ollama.embeddingModel")!;
    this.openaiApiKey = this.config.get<string>("ai.openai.apiKey")!;
    this.openaiChatModel = this.config.get<string>("ai.openai.chatModel")!;
    this.openaiEmbeddingModel = this.config.get<string>("ai.openai.embeddingModel")!;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.provider === "openai") {
      return this.openaiEmbedding(text);
    }
    return this.ollamaEmbedding(text);
  }

  async chatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    if (this.provider === "openai") {
      return this.openaiChat(systemPrompt, userPrompt);
    }
    return this.ollamaChat(systemPrompt, userPrompt);
  }

  async extractPreferences(briefText: string): Promise<ExtractedPreference[]> {
    const systemPrompt = `You are an AI that extracts structured partner preferences from free-text descriptions.
Given a user's description of their ideal partner, extract each distinct preference as a structured object.

For each preference, determine:
- attribute: a short label (e.g. "religion", "employment", "height", "lifestyle", "values")
- normalizedValue: a standardized value (e.g. "christian", "employed", "non_smoker")
- originalWording: the exact words from the user's text
- category: one of "relationship_intention", "values_lifestyle", "personal_preferences", "long_term_ambitions", "interests", "other"
- priority: infer from language intensity — "non_negotiable" for absolute requirements ("must", "need", "require"), "strong" for clear preferences ("prefer", "really want", "ideally"), "nice_to_have" for casual wishes ("would be nice", "bonus", "appreciate")
- confidence: 0.0 to 1.0 indicating how confident you are in the extraction

Respond ONLY with a JSON array. No other text.`;

    const response = await this.chatCompletion(systemPrompt, briefText);

    try {
      const parsed = JSON.parse(response);
      if (!Array.isArray(parsed)) {
        this.logger.warn("AI returned non-array response for preference extraction");
        return [];
      }
      return parsed as ExtractedPreference[];
    } catch {
      this.logger.error("Failed to parse AI preference extraction response");
      return [];
    }
  }

  async generateMatchExplanation(
    userProfile: Record<string, any>,
    candidateProfile: Record<string, any>,
    preferences: Record<string, any>[],
  ): Promise<{ strengths: string[]; differences: string[] }> {
    const systemPrompt = `You are a matchmaking assistant. Given two user profiles and preference data, explain why they could be a good match.

Respond ONLY with JSON in this format:
{
  "strengths": ["reason 1", "reason 2", ...],
  "differences": ["difference 1", "difference 2", ...]
}

Strengths should highlight compatibility. Differences should note areas where they differ but frame constructively. Keep each item to one sentence. Max 5 strengths and 3 differences.`;

    const userPrompt = JSON.stringify({
      userProfile,
      candidateProfile,
      preferences,
    });

    const response = await this.chatCompletion(systemPrompt, userPrompt);

    try {
      const parsed = JSON.parse(response);
      return {
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        differences: Array.isArray(parsed.differences) ? parsed.differences : [],
      };
    } catch {
      this.logger.error("Failed to parse match explanation response");
      return { strengths: [], differences: [] };
    }
  }

  // --- Ollama implementations ---

  private async ollamaEmbedding(text: string): Promise<number[]> {
    const url = `${this.ollamaUrl}/api/embed`;
    this.logger.debug(`Ollama embedding for: "${text.substring(0, 100)}..."`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.ollamaEmbeddingModel, input: text }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Ollama embed request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as { embeddings: number[][] };
    return data.embeddings[0];
  }

  private async ollamaChat(systemPrompt: string, userPrompt: string): Promise<string> {
    const url = `${this.ollamaUrl}/api/chat`;
    this.logger.debug(`Ollama chat request with model ${this.ollamaChatModel}`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.ollamaChatModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Ollama chat request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as { message: { content: string } };
    return data.message.content;
  }

  // --- OpenAI implementations ---

  private async openaiEmbedding(text: string): Promise<number[]> {
    this.logger.debug(`OpenAI embedding for: "${text.substring(0, 100)}..."`);

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: this.openaiEmbeddingModel,
        input: text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI embedding request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as { data: { embedding: number[] }[] };
    return data.data[0].embedding;
  }

  private async openaiChat(systemPrompt: string, userPrompt: string): Promise<string> {
    this.logger.debug(`OpenAI chat request with model ${this.openaiChatModel}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: this.openaiChatModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI chat request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0].message.content;
  }
}
