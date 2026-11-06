import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { MatchingController } from "./matching.controller";
import { MatchingService } from "./matching.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}
