import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./auth.dto";
import { PrismaService } from "src/prisma";
import * as argon from "argon2";
import { sendSMS } from "@/lib/netgsm";

@Injectable()
export class AuthService {
  private passwordTokens = new Map<string, string>();
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
      throw new BadRequestException("Kullanıcı bulunamadı");
    }

    // verify password
    const isValid = await argon.verify(user.password, body.password);
    if (!isValid) {
      throw new BadRequestException("Kullanıcı adı veya şifre hatalı");
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

  forgetPassword = async (username: string) => {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // send sms or email 8 digit numeric code
    const token = Math.floor(10000000 + Math.random() * 90000000).toString();
    this.passwordTokens.set(token, user.id);

    await sendSMS(user.phoneNumber, `Şifrenizi sıfırlamak için kod: ${token}`);

    return true;
  };

  resetPassword = async (token: string, password: string) => {
    const userId = this.passwordTokens.get(token);
    if (!userId) {
      throw new BadRequestException("Invalid token");
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await argon.hash(password),
      },
    });

    this.passwordTokens.delete(token);

    return true;
  };
}
