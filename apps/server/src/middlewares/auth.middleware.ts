import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return next();

    const tokenDoc = await this.prisma.token.findFirst({
      where: { token },
    });

    if (!tokenDoc) return next();
    if (tokenDoc.expiresAt.getTime() < Date.now()) return next();

    const user = await this.prisma.user.findFirst({
      where: {
        id: tokenDoc.userId,
      },
    });

    if (!user) return next();

    // Kullanıcıyı request nesnesine ekleyin
    req.user = user;

    next();
  }
}
