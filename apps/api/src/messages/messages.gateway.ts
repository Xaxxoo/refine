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

@WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
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

      (client as any).userId = payload.sub;
      client.join(payload.sub);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(_client: Socket) {
    // cleanup handled automatically by socket.io room management
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
