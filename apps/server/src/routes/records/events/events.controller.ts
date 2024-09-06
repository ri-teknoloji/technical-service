import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { Roles } from "@/decorators";
import { UserRole } from "@/enums";
import { AuthGuard, RolesGuard } from "@/guards";
import { CreateEventDto, UpdateEventDto } from "./events.dto";

@Controller("records/:recordId/events")
export class EventsController {
  constructor(private eventsService: EventsService) {}

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

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  create(@Param("recordId") recordId: string, @Body() data: CreateEventDto) {
    return this.eventsService.create(recordId, data);
  }

  @Put(":eventId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  update(
    @Param("recordId") recordId: string,
    @Param("eventId") eventId: string,
    @Body() data: UpdateEventDto
  ) {
    return this.eventsService.update(recordId, eventId, data);
  }

  @Delete(":eventId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  remove(
    @Param("recordId") recordId: string,
    @Param("eventId") eventId: string
  ) {
    return this.eventsService.remove(recordId, eventId);
  }
}
