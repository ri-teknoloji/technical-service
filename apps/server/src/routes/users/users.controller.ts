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
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { AuthGuard, RolesGuard } from "@/guards";
import { GetUser, Roles } from "@/decorators";
import { User } from "@prisma/client";
import { UserRole } from "@/enums";
import { AuthMiddleware } from "@/middlewares";

@Controller("users")
@UsePipes(AuthMiddleware)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async find(@GetUser() user: User) {
    return await this.usersService.find(user);
  }

  @Get(":id")
  async findOne(@GetUser() user: User, @Param("id") id: string) {
    return await this.usersService.findOne(user, id);
  }

  @Post()
  @Roles([UserRole.Admin])
  async create(@Body() body: CreateUserDto) {
    return await this.usersService.create(body);
  }

  @Put(":id")
  @Roles([UserRole.Admin])
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @GetUser() user: User) {
    return await this.usersService.remove(user, id);
  }
}
