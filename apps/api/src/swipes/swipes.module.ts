import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Swipe } from "./entities/swipe.entity";
import { User } from "../users/entities/user.entity";
import { SwipesService } from "./swipes.service";
import { SwipesController } from "./swipes.controller";
import { BlocksModule } from "../blocks/blocks.module";

@Module({
  imports: [TypeOrmModule.forFeature([Swipe, User]), BlocksModule],
  controllers: [SwipesController],
  providers: [SwipesService],
  exports: [SwipesService],
})
export class SwipesModule {}
