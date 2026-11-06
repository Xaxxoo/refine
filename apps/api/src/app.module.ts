import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { EmbeddingModule } from "./embedding/embedding.module";
import { MatchingModule } from "./matching/matching.module";

@Module({
  imports: [DatabaseModule, UsersModule, EmbeddingModule, MatchingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
