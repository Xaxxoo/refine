import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Block } from "./entities/block.entity";
import { Report } from "./entities/report.entity";
import { User } from "../users/entities/user.entity";
import { CreateReportDto } from "./dto/create-report.dto";

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private readonly blocksRepository: Repository<Block>,
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async blockUser(blockerId: string, blockedId: string): Promise<Block> {
    if (blockerId === blockedId) {
      throw new BadRequestException("You cannot block yourself");
    }

    const blockedUser = await this.usersRepository.findOneBy({
      id: blockedId,
    });
    if (!blockedUser) {
      throw new NotFoundException("User not found");
    }

    const existing = await this.blocksRepository.findOneBy({
      blockerId,
      blockedId,
    });
    if (existing) {
      return existing;
    }

    const block = this.blocksRepository.create({ blockerId, blockedId });
    return this.blocksRepository.save(block);
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const block = await this.blocksRepository.findOneBy({
      blockerId,
      blockedId,
    });
    if (!block) {
      throw new NotFoundException("Block not found");
    }
    await this.blocksRepository.remove(block);
  }

  async reportUser(
    reporterId: string,
    reportedId: string,
    dto: CreateReportDto,
  ): Promise<Report> {
    if (reporterId === reportedId) {
      throw new BadRequestException("You cannot report yourself");
    }

    const reportedUser = await this.usersRepository.findOneBy({
      id: reportedId,
    });
    if (!reportedUser) {
      throw new NotFoundException("User not found");
    }

    const report = this.reportsRepository.create({
      reporterId,
      reportedId,
      reason: dto.reason,
      description: dto.description ?? null,
      status: "pending",
    });
    return this.reportsRepository.save(report);
  }

  async getBlockedUserIds(userId: string): Promise<string[]> {
    const blocks = await this.blocksRepository.find({
      where: [{ blockerId: userId }, { blockedId: userId }],
      select: ["blockerId", "blockedId"],
    });

    const ids = new Set<string>();
    for (const block of blocks) {
      if (block.blockerId !== userId) ids.add(block.blockerId);
      if (block.blockedId !== userId) ids.add(block.blockedId);
    }
    return Array.from(ids);
  }

  async isBlocked(userA: string, userB: string): Promise<boolean> {
    const block = await this.blocksRepository.findOne({
      where: [
        { blockerId: userA, blockedId: userB },
        { blockerId: userB, blockedId: userA },
      ],
    });
    return !!block;
  }
}
