import { registerAs } from "@nestjs/config";

export default registerAs("ai", () => ({
  provider: process.env.AI_PROVIDER || "ollama",
  ollama: {
    url: process.env.OLLAMA_URL || "http://localhost:11434",
    chatModel: process.env.OLLAMA_CHAT_MODEL || "llama3.2",
    embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    chatModel: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  },
}));
