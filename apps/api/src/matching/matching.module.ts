import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { MatchExplanation } from "./entities/match-explanation.entity";
import { MatchingController } from "./matching.controller";
import { MatchingService } from "./matching.service";
import { BriefsModule } from "../briefs/briefs.module";
import { AiModule } from "../ai/ai.module";
import { BlocksModule } from "../blocks/blocks.module";
import { SwipesModule } from "../swipes/swipes.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, MatchExplanation]),
    BriefsModule,
    AiModule,
    BlocksModule,
    SwipesModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
