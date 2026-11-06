import { Controller, Get, Param, Query } from "@nestjs/common";
import { MatchingService } from "./matching.service";

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
}
