import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private appUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>("resend.apiKey"));
    this.fromEmail = this.configService.get<string>("resend.fromEmail")!;
    this.appUrl = this.configService.get<string>("resend.appUrl")!;
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.appUrl}/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: "Verify your email address",
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.appUrl}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
      `,
    });
  }
}
