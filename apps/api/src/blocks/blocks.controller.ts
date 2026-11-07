import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { BlocksService } from "./blocks.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("users")
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":id/block")
  blockUser(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.blocksService.blockUser(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/block")
  unblockUser(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.blocksService.unblockUser(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/report")
  reportUser(
    @Param("id") id: string,
    @Body() dto: CreateReportDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.blocksService.reportUser(user.userId, id, dto);
  }
}
