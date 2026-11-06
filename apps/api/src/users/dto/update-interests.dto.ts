import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class UpdateInterestsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  interests!: string[];
}
