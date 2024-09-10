import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { LoggerMiddleware, AuthMiddleware } from "@/middlewares";

import { ApiController } from "./api.controller";

import { UsersModule } from "@/routes/users";
import { AuthModule } from "@/routes/auth";
import { TokensModule } from "@/routes/tokens";
import { RecordsModule } from "@/routes/records";
import { FilesModule } from "@/routes/files";

@Module({
  imports: [UsersModule, AuthModule, TokensModule, RecordsModule, FilesModule],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes("*");
  }
}
