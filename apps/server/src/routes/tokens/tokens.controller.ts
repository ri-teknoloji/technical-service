import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { TokensService } from "./tokens.service";

@Controller("tokens")
@UseGuards(AuthGuard)
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Post()
  async create(@GetUser("id") userId: string) {
    return await this.tokensService.create(userId);
  }

  @Delete(":id")
  async delete(@GetUser("id") userId: string, @Param("id") id: string) {
    return await this.tokensService.delete(userId, id);
  }

  @Get()
  async find(@GetUser() user: User) {
    return await this.tokensService.find(user);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.tokensService.findOne(id);
  }
}
