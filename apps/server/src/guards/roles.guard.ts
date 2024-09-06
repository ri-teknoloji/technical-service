import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "@/decorators";
import { User } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles = (roles: string[], userRoles: string[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const isAllowed = this.matchRoles(roles, user.roles);

    if (!isAllowed) {
      throw new ForbiddenException(
        "You don't have permission to access this resource"
      );
    }

    return isAllowed;
  }
}
