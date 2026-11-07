import { IsString, MaxLength, IsOptional } from "class-validator";

export class CreateReportDto {
  @IsString()
  @MaxLength(100)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
