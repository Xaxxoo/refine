import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Swipe } from "./entities/swipe.entity";
import { BlocksService } from "../blocks/blocks.service";
import { CreateSwipeDto } from "./dto/create-swipe.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class SwipesService {
  constructor(
    @InjectRepository(Swipe)
    private readonly swipesRepository: Repository<Swipe>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly blocksService: BlocksService,
  ) {}

  async createSwipe(
    swiperId: string,
    dto: CreateSwipeDto,
  ): Promise<{ swipe: Swipe; isMatch: boolean }> {
    if (swiperId === dto.targetUserId) {
      throw new BadRequestException("You cannot swipe on yourself");
    }

    const targetUser = await this.usersRepository.findOneBy({
      id: dto.targetUserId,
    });
    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    const blocked = await this.blocksService.isBlocked(
      swiperId,
      dto.targetUserId,
    );
    if (blocked) {
      throw new ForbiddenException("Cannot interact with this user");
    }

    const existing = await this.swipesRepository.findOneBy({
      swiperId,
      swipedId: dto.targetUserId,
    });
    if (existing) {
      throw new ConflictException("You have already swiped on this user");
    }

    let isMatch = false;

    if (dto.action === "like") {
      const reverseSwipe = await this.swipesRepository.findOneBy({
        swiperId: dto.targetUserId,
        swipedId: swiperId,
        action: "like",
      });

      if (reverseSwipe) {
        isMatch = true;
        reverseSwipe.isMatch = true;
        await this.swipesRepository.save(reverseSwipe);
      }
    }

    const swipe = this.swipesRepository.create({
      swiperId,
      swipedId: dto.targetUserId,
      action: dto.action,
      isMatch,
    });
    await this.swipesRepository.save(swipe);

    return { swipe, isMatch };
  }

  async getMatches(userId: string): Promise<User[]> {
    const swipes = await this.swipesRepository.find({
      where: { swiperId: userId, isMatch: true },
      relations: ["swiped"],
    });

    return swipes.map((s) => s.swiped);
  }

  async areMatched(userA: string, userB: string): Promise<boolean> {
    const swipe = await this.swipesRepository.findOneBy({
      swiperId: userA,
      swipedId: userB,
      isMatch: true,
    });
    return !!swipe;
  }

  async unmatch(userId: string, matchedUserId: string): Promise<{ message: string }> {
    const swipeA = await this.swipesRepository.findOneBy({
      swiperId: userId,
      swipedId: matchedUserId,
      isMatch: true,
    });

    const swipeB = await this.swipesRepository.findOneBy({
      swiperId: matchedUserId,
      swipedId: userId,
      isMatch: true,
    });

    if (!swipeA || !swipeB) {
      throw new NotFoundException("Match not found");
    }

    swipeA.isMatch = false;
    swipeB.isMatch = false;
    await this.swipesRepository.save([swipeA, swipeB]);

    return { message: "Unmatched successfully" };
  }

  async getSwipedUserIds(userId: string): Promise<string[]> {
    const swipes = await this.swipesRepository.find({
      where: { swiperId: userId },
      select: ["swipedId"],
    });
    return swipes.map((s) => s.swipedId);
  }
}
