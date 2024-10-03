import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UserRole } from "@prisma/client";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { ImagesService } from "./images.service";

@Controller("records/:recordId/images")
@UseGuards(AuthGuard)
@Roles([UserRole.admin])
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("images"))
  create(
    @Param("recordId") recordId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.imagesService.create(recordId, files);
  }

  @Delete(":id")
  remove(@Param() { id, recordId }: { id: string; recordId: string }) {
    return this.imagesService.delete(recordId, id);
  }
}
