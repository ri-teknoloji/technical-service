import { PrismaService } from "@/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRecordDto, UpdateRecordDto } from "./records.dto";
import { sendSMS } from "@/lib/netgsm";

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  find = async () => {
    const records = await this.prisma.serviceRecord.findMany();
    return records;
  };

  findOne = async (id: string) => {
    const record = this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    return record;
  };

  search = async (query: string) => {
    const records = await this.prisma.serviceRecord.findMany({
      where: {
        OR: [
          {
            userId: {
              contains: query,
            },
          },
        ],
      },
    });

    return records;
  };

  create = async (data: CreateRecordDto) => {
    console.log(data);
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new NotFoundException("Kullanıcı bulunamadı.");
    }

    const record = await this.prisma.serviceRecord.create({
      data,
    });

    // Send SMS
    if (user && user.phoneNumber) {
      await sendSMS(
        user.phoneNumber,
        `Servis kaydınız oluşturuldu: ${record.productName}. Detaylar için siteyi ziyaret ediniz.`
      );
    }

    return record;
  };

  update = async (id: string, data: UpdateRecordDto) => {
    const isExist = await this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    const record = await this.prisma.serviceRecord.update({
      where: {
        id,
      },
      data,
    });

    return record;
  };

  remove = async (id: string) => {
    const isExist = await this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    return this.prisma.serviceRecord.delete({
      where: {
        id,
      },
      include: {
        events: true,
      },
    });
  };
}
