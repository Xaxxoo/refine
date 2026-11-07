import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SwipesService } from "./swipes.service";
import { CreateSwipeDto } from "./dto/create-swipe.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("swipes")
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @UseGuards(JwtAuthGuard)
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
}
