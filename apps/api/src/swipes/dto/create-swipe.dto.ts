import { IsUUID, IsIn } from "class-validator";

export class CreateSwipeDto {
  @IsUUID()
  targetUserId!: string;

  @IsIn(["like", "pass"])
  action!: string;
}
