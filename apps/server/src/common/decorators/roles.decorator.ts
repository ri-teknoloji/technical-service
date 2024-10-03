import { Reflector } from "@nestjs/core";

import { UserRole } from "@/prisma";

export const Roles = Reflector.createDecorator<UserRole[]>();
