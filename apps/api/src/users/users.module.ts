import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserPreferences } from "./entities/user-preferences.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { EmbeddingModule } from "../embedding/embedding.module";
import { BlocksModule } from "../blocks/blocks.module";
import { SwipesModule } from "../swipes/swipes.module";
import { MatchingModule } from "../matching/matching.module";
import { BriefsModule } from "../briefs/briefs.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPreferences]),
    EmbeddingModule,
    BlocksModule,
    SwipesModule,
    forwardRef(() => MatchingModule),
    forwardRef(() => BriefsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
