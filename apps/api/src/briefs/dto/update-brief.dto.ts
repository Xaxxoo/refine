import { IsString, IsOptional, MaxLength } from "class-validator";

export class UpdateBriefDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  rawText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}
