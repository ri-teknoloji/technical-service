import { Module } from "@nestjs/common";

import { EventsModule } from "./events/events.module";
import { ImagesModule } from "./images/images.module";

import { RecordsController } from "./records.controller";
import { RecordsService } from "./records.service";

@Module({
  imports: [EventsModule, ImagesModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
