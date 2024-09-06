import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "@/guards";
import { PrismaModule } from "@/prisma";
import { mailerConfig } from "@/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { ApiModule } from "@/routes/api";
import { MulterModule } from "@nestjs/platform-express";
import multer from "multer";

const clientDist = join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "apps",
  "client",
  "dist"
);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: clientDist,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    PrismaModule,
    MailerModule.forRoot(mailerConfig),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    ApiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
