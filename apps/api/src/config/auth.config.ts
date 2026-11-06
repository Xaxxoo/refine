import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
}));
