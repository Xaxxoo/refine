import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { MoreThan, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { EmailVerificationToken } from "./entities/email-verification-token.entity";
import { PasswordResetToken } from "./entities/password-reset-token.entity";
import { EmailService } from "../email/email.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(EmailVerificationToken)
    private readonly verificationTokenRepository: Repository<EmailVerificationToken>,
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepository: Repository<PasswordResetToken>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (existing) {
      throw new ConflictException("Email or username already taken");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.usersRepository.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
      displayName: dto.displayName,
    });
    await this.usersRepository.save(user);

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, username: user.username },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, username: user.username },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>("auth.jwtRefreshSecret"),
      });
      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async sendVerificationEmail(userId: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (user.isVerified) {
      return { message: "Email is already verified" };
    }

    // Delete existing tokens for this user
    await this.verificationTokenRepository.delete({ userId });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const verificationToken = this.verificationTokenRepository.create({
      userId,
      token,
      expiresAt,
    });
    await this.verificationTokenRepository.save(verificationToken);

    await this.emailService.sendVerificationEmail(user.email, token);

    return { message: "Verification email sent" };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const verificationToken = await this.verificationTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()) },
    });

    if (!verificationToken) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    await this.usersRepository.update(verificationToken.userId, {
      isVerified: true,
    });
    await this.verificationTokenRepository.delete({ userId: verificationToken.userId });

    return { message: "Email verified successfully" };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ email });

    // Always return same message to prevent email enumeration
    const message = "If an account with that email exists, a password reset link has been sent";

    if (!user) {
      return { message };
    }

    // Delete existing tokens for this user
    await this.resetTokenRepository.delete({ userId: user.id });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const resetToken = this.resetTokenRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });
    await this.resetTokenRepository.save(resetToken);

    await this.emailService.sendPasswordResetEmail(email, token);

    return { message };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const resetToken = await this.resetTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()) },
    });

    if (!resetToken) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersRepository.update(resetToken.userId, {
      password: hashedPassword,
    });
    await this.resetTokenRepository.delete({ userId: resetToken.userId });

    return { message: "Password reset successfully" };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessExpiry = this.config.get<string>("auth.accessTokenExpiry")!;
    const refreshExpiry = this.config.get<string>("auth.refreshTokenExpiry")!;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>("auth.jwtSecret"),
        expiresIn: accessExpiry as `${number}${"s" | "m" | "h" | "d"}`,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>("auth.jwtRefreshSecret"),
        expiresIn: refreshExpiry as `${number}${"s" | "m" | "h" | "d"}`,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
