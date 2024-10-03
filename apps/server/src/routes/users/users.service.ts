import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import argon2 from "argon2";

import { UserRole } from "@/prisma";
import { PrismaService } from "@/prisma";
import { randomString } from "@/utils";

import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  create = async (data: CreateUserDto) => {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (isExist) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await argon2.hash(data.password || randomString(16));

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return user;
  };

  find = async (user: User) => {
    const isAdmin = user.roles.includes(UserRole.admin);
    return isAdmin
      ? await this.prisma.user.findMany()
      : await this.prisma.user.findMany({ where: { id: user.id } });
  };

  findOne = async (user: User, id: string) => {
    const isAdmin = user.roles.includes(UserRole.admin);
    const doc = isAdmin
      ? await this.prisma.user.findFirst({
          include: { ServiceRecord: true, Token: true },
          where: { id },
        })
      : await this.prisma.user.findFirst({ where: { id: user.id } });

    if (!doc) {
      throw new NotFoundException("User not found");
    }

    return doc;
  };

  remove = async (user: User, id: string) => {
    const isAdmin = user.roles.includes(UserRole.admin);

    const isExist = await this.prisma.user.findFirst({ where: { id } });
    if (!isExist) {
      throw new NotFoundException("User not found");
    }

    await (isAdmin
      ? this.prisma.user.delete({ where: { id } })
      : this.prisma.user.delete({ where: { id: user.id } }));

    return true;
  };

  update = async (id: string, data: UpdateUserDto) => {
    const isExist = await this.prisma.user.findFirst({ where: { id } });
    if (!isExist) {
      throw new BadRequestException("User not found");
    }

    const isCredentialsAvailable = await this.prisma.user.findFirst({
      where: {
        NOT: { id },
        OR: [{ username: data.username }, { email: data.email }],
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

    const user = await this.prisma.user.update({ data, where: { id } });

    return user;
  };

  constructor(private prisma: PrismaService) {}
}
