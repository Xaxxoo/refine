import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ReviewReportDto } from "./dto/review-report.dto";
import { AdminUsersQueryDto } from "./dto/admin-users-query.dto";

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("reports")
  listReports(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("status") status?: string,
  ) {
    return this.adminService.listReports(
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
      status,
    );
  }

  @Get("reports/:id")
  getReport(@Param("id") id: string) {
    return this.adminService.getReport(id);
  }

  @Post("reports/:id/review")
  reviewReport(
    @Param("id") id: string,
    @CurrentUser("sub") adminId: string,
    @Body() dto: ReviewReportDto,
  ) {
    return this.adminService.reviewReport(id, adminId, dto);
  }

  @Get("users")
  listUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Post("users/:id/suspend")
  suspendUser(@Param("id") id: string) {
    return this.adminService.suspendUser(id);
  }

  @Post("users/:id/unsuspend")
  unsuspendUser(@Param("id") id: string) {
    return this.adminService.unsuspendUser(id);
  }

  @Get("dashboard")
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
