import { AWS } from "@/lib/aws";
import { PrismaService } from "@/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  create = async (recordId: string, files: Express.Multer.File[]) => {
    const fileKeys: string[] = [];
    for (const file of files) {
      const key = await AWS.uploadFile(file);
      fileKeys.push(key);
    }

    const record = await this.prisma.serviceRecord.findFirst({
      where: {
        id: recordId,
      },
    });

    if (!record) throw new NotFoundException("Kayıt bulunamadı");

    const updatedRecord = await this.prisma.serviceRecord.update({
      where: {
        id: recordId,
      },
      data: {
        ...record,
        images: [...record.images, ...fileKeys],
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
      where: {
        id: recordId,
      },
      data: {
        ...record,
        images: record.images.filter((key) => key !== imageKey),
      },
    });

    await AWS.deleteFile(imageKey);

    return updatedRecord;
  };
}
