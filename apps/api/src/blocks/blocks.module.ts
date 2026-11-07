import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "./entities/block.entity";
import { Report } from "./entities/report.entity";
import { User } from "../users/entities/user.entity";
import { BlocksService } from "./blocks.service";
import { BlocksController } from "./blocks.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Block, Report, User])],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
