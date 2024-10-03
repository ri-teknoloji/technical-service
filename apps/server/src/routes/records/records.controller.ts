import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";
import { UserRole } from "@/prisma";

import { CreateRecordDto, UpdateRecordDto } from "./records.dto";
import { RecordsService } from "./records.service";

@Controller("records")
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  create(@Body() data: CreateRecordDto) {
    return this.recordsService.create(data);
  }

  @Get(":id/delivery-code")
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  deliverCode(@Param("id") id: string) {
    return this.recordsService.getCode(id);
  }

  @Get()
  find() {
    return this.recordsService.find();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recordsService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  remove(@Param("id") id: string) {
    return this.recordsService.remove(id);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  update(@Param("id") id: string, @Body() data: UpdateRecordDto) {
    return this.recordsService.update(id, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post(":id/verify")
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  verify(@Param("id") id: string, @Body("code") code: string) {
    return this.recordsService.verifyCode(id, code);
  }
}
