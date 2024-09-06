import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./auth.dto";
import { PrismaService } from "src/prisma";
import * as argon from "argon2";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login = async (body: LoginDto) => {
    // find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.username }],
      },
    });

    // if user not found
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    // verify password
    const isValid = await argon.verify(user?.password, body.password);
    if (!isValid) {
      throw new BadRequestException("Invalid credentials");
    }

    const freshToken = await this.prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return {
      ...user,
      token: freshToken.token,
    };
  };

  register = async (body: RegisterDto) => {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (isExist) {
      throw new BadRequestException("User already exists");
    }

    const user = await this.prisma.user.create({
      data: {
        ...body,
        password: await argon.hash(body.password),
      },
    });

    return user;
  };
}
