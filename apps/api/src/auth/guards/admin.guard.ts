import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    if (!userId) {
      throw new ForbiddenException("Authentication required");
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ForbiddenException("User not found");
    }

    if (user.role !== "admin" && user.role !== "moderator") {
      throw new ForbiddenException("Admin or moderator access required");
    }

    return true;
  }
}
