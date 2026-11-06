import { Body, Controller, Param, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateInterestsDto } from "./dto/update-interests.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(":id/interests")
  updateInterests(
    @Param("id") id: string,
    @Body() dto: UpdateInterestsDto,
  ) {
    return this.usersService.updateInterests(id, dto.interests);
  }
}
