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
import { RecordsService } from "./records.service";
import { AuthGuard } from "@/guards";
import { Roles } from "@/decorators";
import { UserRole } from "@/enums";
import { CreateRecordDto, UpdateRecordDto } from "./records.dto";

@Controller("records")
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Get()
  find() {
    return this.recordsService.find();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recordsService.findOne(id);
  }

  @Get(":id/delivery-code")
  @UseGuards(AuthGuard)
  @Roles([UserRole.Admin])
  deliverCode(@Param("id") id: string) {
    return this.recordsService.getCode(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles([UserRole.Admin])
  create(@Body() data: CreateRecordDto) {
    return this.recordsService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post(":id/verify")
  @UseGuards(AuthGuard)
  @Roles([UserRole.Admin])
  verify(@Param("id") id: string, @Body("code") code: string) {
    return this.recordsService.verifyCode(id, code);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @Roles([UserRole.Admin])
  update(@Param("id") id: string, @Body() data: UpdateRecordDto) {
    return this.recordsService.update(id, data);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles([UserRole.Admin])
  remove(@Param("id") id: string) {
    return this.recordsService.remove(id);
  }
}
