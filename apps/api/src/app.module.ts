import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
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
import { AiModule } from "./ai/ai.module";
import { BriefsModule } from "./briefs/briefs.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
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
    AiModule,
    BriefsModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
