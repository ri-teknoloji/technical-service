import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma";
import { User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { UserRole } from "@/enums";
import argon2 from "argon2";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  find = async (user: User) => {
    const isAdmin = user.roles.includes(UserRole.Admin);
    return isAdmin
      ? await this.prisma.user.findMany()
      : await this.prisma.user.findMany({ where: { id: user.id } });
  };

  findOne = async (user: User, id: string) => {
    const isAdmin = user.roles.includes(UserRole.Admin);
    const doc = isAdmin
      ? await this.prisma.user.findFirst({
          where: { id },
          include: { ServiceRecord: true, Token: true },
        })
      : await this.prisma.user.findFirst({ where: { id: user.id } });

    if (!doc) {
      throw new NotFoundException("User not found");
    }

    return doc;
  };

  create = async (data: CreateUserDto) => {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (isExist) {
      throw new BadRequestException("User already exists");
    }

    data.password = await argon2.hash(data.password);

    const user = await this.prisma.user.create({
      data,
    });

    return user;
  };

  update = async (id: string, data: UpdateUserDto) => {
    const isExist = await this.prisma.user.findFirst({ where: { id } });
    if (!isExist) {
      throw new BadRequestException("User not found");
    }

    const isCredentialsAvailable = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
        NOT: { id },
      },
    });

    if (isCredentialsAvailable) {
      throw new BadRequestException("Username or email already exists");
    }

    if (data.password && data.password.length > 0) {
      data.password = await argon2.hash(data.password);
    } else {
      delete data.password;
    }

    const user = await this.prisma.user.update({ where: { id }, data });

    return user;
  };

  remove = async (user: User, id: string) => {
    const isAdmin = user.roles.includes(UserRole.Admin);

    const isExist = await this.prisma.user.findFirst({ where: { id } });
    if (!isExist) {
      throw new NotFoundException("User not found");
    }

    await (isAdmin
      ? this.prisma.user.delete({ where: { id } })
      : this.prisma.user.delete({ where: { id: user.id } }));

    return true;
  };
}
