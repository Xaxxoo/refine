import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { EmbeddingModule } from "./embedding/embedding.module";
import { MatchingModule } from "./matching/matching.module";
import { BlocksModule } from "./blocks/blocks.module";
import { SwipesModule } from "./swipes/swipes.module";
import { MessagesModule } from "./messages/messages.module";
import { EmailModule } from "./email/email.module";
import { UploadModule } from "./upload/upload.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmbeddingModule,
    MatchingModule,
    BlocksModule,
    SwipesModule,
    MessagesModule,
    EmailModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
