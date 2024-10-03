import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser } from "@/common/decorators";

import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("forget-password")
  forgetPassword(@Body("username") username: string) {
    return this.authService.forgetPassword(username);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get("me")
  me(@GetUser() user: User) {
    if (!user) throw new UnauthorizedException("Unauthorized");
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  resetPassword(
    @Body("token") token: string,
    @Body("password") password: string
  ) {
    return this.authService.resetPassword(token, password);
  }
}
