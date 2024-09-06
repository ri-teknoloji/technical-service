import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { GetUser } from "@/decorators";
import { AuthGuard } from "@/guards";
import { LoginDto, RegisterDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  me(@GetUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
