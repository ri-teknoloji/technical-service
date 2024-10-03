import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "@/aws";
import { PrismaService } from "@/prisma";

@Injectable()
export class ImagesService {
  create = async (recordId: string, files: Express.Multer.File[]) => {
    const fileKeys: string[] = [];
    for (const file of files) {
      const key = await this.s3.uploadFile(file);
      fileKeys.push(key);
    }

    const record = await this.prisma.serviceRecord.findFirst({
      where: {
        id: recordId,
      },
    });

    if (!record) throw new NotFoundException("Kayıt bulunamadı");

    const updatedRecord = await this.prisma.serviceRecord.update({
      data: {
        ...record,
        images: [...record.images, ...fileKeys],
      },
      where: {
        id: recordId,
      },
    });

    return updatedRecord;
  };

  delete = async (recordId: string, imageKey: string) => {
    const record = await this.prisma.serviceRecord.findFirst({
      where: {
        id: recordId,
      },
    });

    if (!record) throw new NotFoundException("Kayıt bulunamadı");

    const updatedRecord = await this.prisma.serviceRecord.update({
      data: {
        ...record,
        images: record.images.filter((key) => key !== imageKey),
      },
      where: {
        id: recordId,
      },
    });

    await this.s3.deleteFile(imageKey);

    return updatedRecord;
  };

  constructor(
    private prisma: PrismaService,
    private s3: S3Service
  ) {}
}
