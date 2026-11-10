import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class ReviewReportDto {
  @IsIn(["dismissed", "warning_issued", "suspended", "banned"])
  status!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
