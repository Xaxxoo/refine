import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateInterestsDto } from "./dto/update-interests.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DiscoverQueryDto } from "./dto/discover-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("discover")
  discover(
    @Query() query: DiscoverQueryDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.usersService.discoverUsers(
      user.userId,
      query.limit ?? 20,
      query.offset ?? 0,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("me")
  deleteAccount(@CurrentUser() user: { userId: string }) {
    return this.usersService.deleteAccount(user.userId);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateProfile(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { userId: string },
  ) {
    if (user.userId !== id) {
      throw new ForbiddenException("You can only update your own profile");
    }
    return this.usersService.updateProfile(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id/interests")
  updateInterests(
    @Param("id") id: string,
    @Body() dto: UpdateInterestsDto,
    @CurrentUser() user: { userId: string },
  ) {
    if (user.userId !== id) {
      throw new ForbiddenException("You can only update your own interests");
    }
    return this.usersService.updateInterests(id, dto.interests);
  }
}
