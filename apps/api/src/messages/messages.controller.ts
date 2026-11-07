import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { MessagesQueryDto } from "./dto/messages-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get("conversations")
  getConversations(@CurrentUser() user: { userId: string }) {
    return this.messagesService.getConversations(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  getMessageHistory(
    @Param("userId") userId: string,
    @Query() query: MessagesQueryDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.messagesService.getMessageHistory(
      user.userId,
      userId,
      query.limit ?? 50,
      query.offset ?? 0,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(":userId")
  sendMessage(
    @Param("userId") userId: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.messagesService.sendMessage(user.userId, userId, dto.content);
  }
}
