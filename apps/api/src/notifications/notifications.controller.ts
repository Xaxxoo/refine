import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { NotificationsQueryDto } from "./dto/notifications-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getNotifications(
    @CurrentUser("sub") userId: string,
    @Query() query: NotificationsQueryDto,
  ) {
    return this.notificationsService.getNotifications(
      userId,
      query.limit,
      query.offset,
    );
  }

  @Get("unread-count")
  getUnreadCount(@CurrentUser("sub") userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(":id/read")
  markAsRead(
    @CurrentUser("sub") userId: string,
    @Param("id") id: string,
  ) {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Post("read-all")
  markAllAsRead(@CurrentUser("sub") userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
