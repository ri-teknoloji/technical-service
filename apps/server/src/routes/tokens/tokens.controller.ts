import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { GetUser } from "@/decorators";
import { User } from "@prisma/client";
import { AuthGuard } from "@/guards";

@Controller("tokens")
@UseGuards(AuthGuard)
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Get()
  async find(@GetUser() user: User) {
    return await this.tokensService.find(user);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.tokensService.findOne(id);
  }

  @Post()
  async create(@GetUser("id") userId: string) {
    return await this.tokensService.create(userId);
  }

  @Delete(":id")
  async delete(@GetUser("id") userId: string, @Param("id") id: string) {
    return await this.tokensService.delete(userId, id);
  }
}
