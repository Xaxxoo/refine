import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Report } from "../blocks/entities/report.entity";
import { ReviewReportDto } from "./dto/review-report.dto";
import { AdminUsersQueryDto } from "./dto/admin-users-query.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  async listReports(
    limit: number = 20,
    offset: number = 0,
    status?: string,
  ): Promise<{ reports: Report[]; total: number }> {
    const where: Record<string, any> = {};
    if (status) {
      where.status = status;
    }

    const [reports, total] = await this.reportsRepository.findAndCount({
      where,
      relations: ["reporter", "reported", "reviewer"],
      order: { createdAt: "DESC" },
      skip: offset,
      take: limit,
    });

    return { reports, total };
  }

  async getReport(reportId: string): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ["reporter", "reported", "reviewer"],
    });
    if (!report) {
      throw new NotFoundException("Report not found");
    }
    return report;
  }

  async reviewReport(
    reportId: string,
    adminId: string,
    dto: ReviewReportDto,
  ): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
    });
    if (!report) {
      throw new NotFoundException("Report not found");
    }

    report.status = dto.status;
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();
    report.actionTaken = dto.status;
    report.adminNotes = dto.adminNotes ?? null;

    // If suspended or banned, deactivate the reported user
    if (dto.status === "suspended" || dto.status === "banned") {
      await this.usersRepository.update(report.reportedId, {
        isActive: false,
      });
    }

    return this.reportsRepository.save(report);
  }

  async suspendUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async unsuspendUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.isActive = true;
    return this.usersRepository.save(user);
  }

  async listUsers(
    query: AdminUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    const qb = this.usersRepository.createQueryBuilder("user");

    if (query.search) {
      qb.andWhere(
        "(user.username ILIKE :search OR user.displayName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${query.search}%` },
      );
    }

    if (query.role) {
      qb.andWhere("user.role = :role", { role: query.role });
    }

    if (query.isActive !== undefined) {
      qb.andWhere("user.isActive = :isActive", { isActive: query.isActive });
    }

    qb.orderBy("user.createdAt", "DESC")
      .skip(query.offset)
      .take(query.limit);

    const [users, total] = await qb.getManyAndCount();
    return { users, total };
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingReports: number;
    totalReports: number;
  }> {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({
      where: { isActive: true },
    });
    const pendingReports = await this.reportsRepository.count({
      where: { status: "pending" },
    });
    const totalReports = await this.reportsRepository.count();

    return { totalUsers, activeUsers, pendingReports, totalReports };
  }
}
