import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartnerBrief } from "./entities/partner-brief.entity";
import { StructuredPreference } from "./entities/structured-preference.entity";
import { BriefsService } from "./briefs.service";
import { BriefsController } from "./briefs.controller";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerBrief, StructuredPreference]),
    AiModule,
  ],
  controllers: [BriefsController],
  providers: [BriefsService],
  exports: [BriefsService],
})
export class BriefsModule {}
