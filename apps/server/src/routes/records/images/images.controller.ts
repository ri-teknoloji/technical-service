import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "@/decorators";
import { UserRole } from "@/enums";

@Controller("records/:recordId/images")
@Roles([UserRole.Admin])
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
  remove(@Param() { recordId, id }: { recordId: string; id: string }) {
    return this.imagesService.delete(recordId, id);
  }
}
