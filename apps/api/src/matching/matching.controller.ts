import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { MatchingService } from "./matching.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NearbyQueryDto } from "./dto/nearby-query.dto";

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
}
