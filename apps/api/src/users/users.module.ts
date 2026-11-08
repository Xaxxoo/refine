import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserPreferences } from "./entities/user-preferences.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { EmbeddingModule } from "../embedding/embedding.module";
import { BlocksModule } from "../blocks/blocks.module";
import { SwipesModule } from "../swipes/swipes.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPreferences]),
    EmbeddingModule,
    BlocksModule,
    SwipesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
