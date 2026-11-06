import { registerAs } from "@nestjs/config";

export default registerAs("ollama", () => ({
  url: process.env.OLLAMA_URL || "http://localhost:11434",
  model: "nomic-embed-text",
}));
