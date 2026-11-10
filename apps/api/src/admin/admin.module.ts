import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Report } from "../blocks/entities/report.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User, Report])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
