import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { BriefsService } from "./briefs.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateBriefDto } from "./dto/create-brief.dto";
import { UpdateBriefDto } from "./dto/update-brief.dto";

@UseGuards(JwtAuthGuard)
@Controller("briefs")
export class BriefsController {
  constructor(private readonly briefsService: BriefsService) {}

  @Post()
  create(@CurrentUser("sub") userId: string, @Body() dto: CreateBriefDto) {
    return this.briefsService.createBrief(userId, dto);
  }

  @Get()
  findAll(@CurrentUser("sub") userId: string) {
    return this.briefsService.getBriefs(userId);
  }

  @Get(":id")
  findOne(@CurrentUser("sub") userId: string, @Param("id") id: string) {
    return this.briefsService.getBrief(userId, id);
  }

  @Patch(":id")
  update(
    @CurrentUser("sub") userId: string,
    @Param("id") id: string,
    @Body() dto: UpdateBriefDto,
  ) {
    return this.briefsService.updateBrief(userId, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser("sub") userId: string, @Param("id") id: string) {
    return this.briefsService.deleteBrief(userId, id);
  }

  @Post(":id/activate")
  activate(@CurrentUser("sub") userId: string, @Param("id") id: string) {
    return this.briefsService.setActiveBrief(userId, id);
  }
}
