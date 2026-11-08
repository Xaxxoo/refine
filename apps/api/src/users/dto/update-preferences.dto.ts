import { IsOptional, IsInt, Min, Max, IsString } from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  maxAge?: number;

  @IsOptional()
  @IsString()
  preferredGender?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  maxDistanceKm?: number;
}
