import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  IsNumber,
  IsInt,
  IsArray,
  IsIn,
  Min,
  Max,
  MaxLength,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  gender?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  selfDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  education?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  religion?: string;

  @IsOptional()
  @IsIn(["long_term", "short_term", "marriage", "casual", "figuring_out"])
  relationshipIntention?: string;

  @IsOptional()
  @IsIn(["never_married", "divorced", "widowed", "separated"])
  maritalHistory?: string;

  @IsOptional()
  @IsIn(["none", "have_children", "want_children", "dont_want", "open_to_children"])
  children?: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  heightCm?: number;

  @IsOptional()
  @IsIn(["never", "occasionally", "regularly"])
  smoking?: string;

  @IsOptional()
  @IsIn(["never", "socially", "regularly"])
  drinking?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  relocationIntention?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  employmentStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredDatingGenders?: string[];
}
