import { Module } from "@nestjs/common";

import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

@Module({
  controllers: [ImagesController],
  imports: [],
  providers: [ImagesService],
})
export class ImagesModule {}
