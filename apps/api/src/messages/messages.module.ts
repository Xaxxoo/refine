import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { Message } from "./entities/message.entity";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { MessagesGateway } from "./messages.gateway";
import { SwipesModule } from "../swipes/swipes.module";
import { BlocksModule } from "../blocks/blocks.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule.register({}),
    SwipesModule,
    BlocksModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
