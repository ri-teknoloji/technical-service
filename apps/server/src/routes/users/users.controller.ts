import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser, Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";
import { AuthMiddleware } from "@/common/middlewares";
import { UserRole } from "@/prisma";

import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UsePipes(AuthMiddleware)
@UseGuards(AuthGuard)
@Roles([UserRole.admin])
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.usersService.create(body);
  }

  @Get()
  async find(@GetUser() user: User) {
    return await this.usersService.find(user);
  }

  @Get(":id")
  async findOne(@GetUser() user: User, @Param("id") id: string) {
    return await this.usersService.findOne(user, id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @GetUser() user: User) {
    return await this.usersService.remove(user, id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body);
  }
}
