import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { SwipesService } from "../swipes/swipes.service";
import { BlocksService } from "../blocks/blocks.service";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly swipesService: SwipesService,
    private readonly blocksService: BlocksService,
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<Message> {
    const blocked = await this.blocksService.isBlocked(senderId, receiverId);
    if (blocked) {
      throw new ForbiddenException("Cannot message this user");
    }

    const matched = await this.swipesService.areMatched(senderId, receiverId);
    if (!matched) {
      throw new ForbiddenException("You must be matched to send messages");
    }

    const message = this.messagesRepository.create({
      senderId,
      receiverId,
      content,
    });
    return this.messagesRepository.save(message);
  }

  async getConversations(userId: string) {
    const conversations = await this.messagesRepository.query(
      `
      WITH partners AS (
        SELECT DISTINCT
          CASE
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END AS partner_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ),
      latest_messages AS (
        SELECT DISTINCT ON (partner_id)
          p.partner_id,
          m.id AS message_id,
          m.content,
          m.sender_id,
          m.created_at
        FROM partners p
        JOIN messages m ON (
          (m.sender_id = $1 AND m.receiver_id = p.partner_id) OR
          (m.sender_id = p.partner_id AND m.receiver_id = $1)
        )
        ORDER BY p.partner_id, m.created_at DESC
      ),
      unread_counts AS (
        SELECT sender_id AS partner_id, COUNT(*) AS unread_count
        FROM messages
        WHERE receiver_id = $1 AND is_read = false
        GROUP BY sender_id
      )
      SELECT
        lm.partner_id AS "partnerId",
        u.username,
        u.display_name AS "displayName",
        u.avatar_url AS "avatarUrl",
        lm.content AS "lastMessage",
        lm.sender_id AS "lastMessageSenderId",
        lm.created_at AS "lastMessageAt",
        COALESCE(uc.unread_count, 0)::int AS "unreadCount"
      FROM latest_messages lm
      JOIN users u ON u.id = lm.partner_id
      LEFT JOIN unread_counts uc ON uc.partner_id = lm.partner_id
      ORDER BY lm.created_at DESC
      `,
      [userId],
    );

    return conversations;
  }

  async getMessageHistory(
    userId: string,
    otherUserId: string,
    limit: number,
    offset: number,
  ): Promise<Message[]> {
    // Mark unread messages from the other user as read
    await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where("sender_id = :otherUserId AND receiver_id = :userId AND is_read = false", {
        otherUserId,
        userId,
      })
      .execute();

    return this.messagesRepository.find({
      where: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async markMessagesAsRead(
    userId: string,
    otherUserId: string,
  ): Promise<void> {
    await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where("sender_id = :otherUserId AND receiver_id = :userId AND is_read = false", {
        otherUserId,
        userId,
      })
      .execute();
  }
}
