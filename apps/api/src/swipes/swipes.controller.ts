import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { SwipesService } from "./swipes.service";
import { CreateSwipeDto } from "./dto/create-swipe.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("swipes")
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 1, ttl: 1000 }, medium: { limit: 10, ttl: 10000 }, long: { limit: 50, ttl: 60000 } })
  @Post()
  createSwipe(
    @Body() dto: CreateSwipeDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.swipesService.createSwipe(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("matches")
  getMatches(@CurrentUser() user: { userId: string }) {
    return this.swipesService.getMatches(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("matches/:userId")
  unmatch(
    @Param("userId") matchedUserId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.swipesService.unmatch(user.userId, matchedUserId);
  }
}
