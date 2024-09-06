import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "@/prisma";

@Injectable()
export class TokensService {
  constructor(private prisma: PrismaService) {}

  async find(user: User) {
    return await this.prisma.token.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.token.findFirst({
      where: {
        id,
      },
    });
  }

  async create(userId: string) {
    const token = await this.prisma.token.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        userId,
      },
    });

    return token;
  }

  async delete(userId: string, id: string) {
    const token = await this.prisma.token.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!token) {
      throw new NotFoundException("Token not found");
    }

    await this.prisma.token.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
