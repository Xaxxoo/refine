import { registerAs } from "@nestjs/config";

export default registerAs("resend", () => ({
  apiKey: process.env.RESEND_API_KEY || "",
  fromEmail: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
  appUrl: process.env.APP_URL || "http://localhost:3000",
}));
