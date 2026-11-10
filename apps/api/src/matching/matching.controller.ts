import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { MatchingService } from "./matching.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { NearbyQueryDto } from "./dto/nearby-query.dto";
import { DiscoverCompatibleQueryDto } from "./dto/discover-compatible-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("matching")
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get("similar/:userId")
  findSimilarUsers(
    @Param("userId") userId: string,
    @Query("limit") limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.matchingService.findSimilarUsers(
      userId,
      isNaN(parsedLimit) ? 10 : parsedLimit,
    );
  }

  @Get("nearby/:userId")
  findNearbyUsers(
    @Param("userId") userId: string,
    @Query() query: NearbyQueryDto,
  ) {
    return this.matchingService.findNearbyUsers(
      userId,
      query.radius,
      query.limit,
    );
  }

  @Get("discover")
  discoverCompatible(
    @CurrentUser("sub") userId: string,
    @Query() query: DiscoverCompatibleQueryDto,
  ) {
    return this.matchingService.discoverCompatible(userId, query.limit, query.offset);
  }

  @Get("explanation/:candidateId")
  getExplanation(
    @CurrentUser("sub") userId: string,
    @Param("candidateId") candidateId: string,
  ) {
    return this.matchingService.getOrGenerateExplanation(userId, candidateId);
  }
}
