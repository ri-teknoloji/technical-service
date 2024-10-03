import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";
import { UserRole } from "@/prisma";

import { CreateEventDto, UpdateEventDto } from "./events.dto";
import { EventsService } from "./events.service";

@Controller("records/:recordId/events")
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  create(@Param("recordId") recordId: string, @Body() data: CreateEventDto) {
    return this.eventsService.create(recordId, data);
  }

  @Get()
  find(@Param("recordId") recordId: string) {
    return this.eventsService.find(recordId);
  }

  @Get(":eventId")
  findOne(
    @Param("recordId") recordId: string,
    @Param("eventId") eventId: string
  ) {
    return this.eventsService.findOne(recordId, eventId);
  }

  @Delete(":eventId")
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  remove(
    @Param("recordId") recordId: string,
    @Param("eventId") eventId: string
  ) {
    return this.eventsService.remove(recordId, eventId);
  }

  @Put(":eventId")
  @UseGuards(AuthGuard)
  @Roles([UserRole.admin])
  update(
    @Param("recordId") recordId: string,
    @Param("eventId") eventId: string,
    @Body() data: UpdateEventDto
  ) {
    return this.eventsService.update(recordId, eventId, data);
  }
}
