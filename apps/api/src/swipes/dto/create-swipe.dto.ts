import { IsUUID, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSwipeDto {
  @IsUUID()
  targetUserId!: string;

  @IsIn(["like", "pass"])
  action!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @IsOptional()
  @IsIn(["discovery", "search", "recommendation"])
  source?: string;
}
