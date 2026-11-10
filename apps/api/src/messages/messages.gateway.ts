import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MessagesService } from "./messages.service";
import { UsersService } from "../users/users.service";
import { SwipesService } from "../swipes/swipes.service";
import { NotificationsService } from "../notifications/notifications.service";

@WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  // Track connected users: userId → Set of socketIds (multi-device support)
  private connectedUsers = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly swipesService: SwipesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("auth.jwtSecret"),
      });

      const userId = payload.sub;
      (client as any).userId = userId;
      client.join(userId);

      // Track connection
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(client.id);

      // Update last seen
      await this.usersService.updateLastSeen(userId);

      // Notify matched users that this user is online
      // (only if this is the first connection for this user)
      if (this.connectedUsers.get(userId)!.size === 1) {
        const matches = await this.swipesService.getMatches(userId);
        for (const match of matches) {
          this.server.to(match.id).emit("userOnline", { userId });
        }
      }
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = (client as any).userId;
    if (!userId) return;

    // Remove socket from tracking
    const sockets = this.connectedUsers.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.connectedUsers.delete(userId);

        // Update last seen
        await this.usersService.updateLastSeen(userId);

        // Notify matched users that this user is offline
        const user = await this.usersService.findById(userId);
        const matches = await this.swipesService.getMatches(userId);
        for (const match of matches) {
          this.server.to(match.id).emit("userOffline", {
            userId,
            lastSeenAt: user.lastSeenAt,
          });
        }
      }
    }
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; content: string },
  ) {
    const senderId = (client as any).userId;
    if (!senderId) return;

    try {
      const message = await this.messagesService.sendMessage(
        senderId,
        data.receiverId,
        data.content,
      );

      this.server.to(data.receiverId).emit("newMessage", message);
      client.emit("messageSent", message);

      // Create persistent notification for the receiver
      const sender = await this.usersService.findById(senderId);
      await this.notificationsService.createNotification({
        userId: data.receiverId,
        type: "new_message",
        title: "New Message",
        body: `${sender.displayName} sent you a message`,
        data: { senderId, messageId: message.id },
      });

      // Emit notification via socket
      this.server.to(data.receiverId).emit("notification", {
        type: "new_message",
        senderId,
        messageId: message.id,
      });
    } catch (error: any) {
      client.emit("messageError", { error: error.message });
    }
  }

  @SubscribeMessage("markRead")
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { otherUserId: string },
  ) {
    const userId = (client as any).userId;
    if (!userId) return;

    await this.messagesService.markMessagesAsRead(userId, data.otherUserId);
    this.server.to(data.otherUserId).emit("messagesRead", { readBy: userId });
  }
}
