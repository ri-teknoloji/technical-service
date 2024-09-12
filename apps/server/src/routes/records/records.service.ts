import { PrismaService } from "@/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRecordDto, UpdateRecordDto } from "./records.dto";
import { sendSMS } from "@/lib/netgsm";

@Injectable()
export class RecordsService {
  deliverCodes = new Map<string, string>();
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

  getCode = async (id: string) => {
    const record = await this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: record.userId,
      },
    });

    if (!user) {
      throw new NotFoundException("Kullanıcı bulunamadı.");
    }

    if (!user.phoneNumber) {
      throw new NotFoundException("Kullanıcının telefon numarası bulunamadı.");
    }

    // 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.deliverCodes.set(code, id);

    await sendSMS(
      user.phoneNumber,
      `Servisten ${record.productName} ürününüzü teslim almak için kodunuz: ${code}`
    );

    return true;
  };

  verifyCode = async (recordId: string, code: string) => {
    const record = await this.prisma.serviceRecord.findUnique({
      where: {
        id: recordId,
      },
    });

    if (!record) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: record.userId,
      },
    });

    if (!user) {
      throw new NotFoundException("Kullanıcı bulunamadı.");
    }

    const isExist = this.deliverCodes.get(code);

    if (!isExist) {
      throw new NotFoundException("Kod bulunamadı.");
    }

    if (isExist !== recordId) {
      throw new NotFoundException("Kod hatalı.");
    }

    await this.prisma.serviceRecord.update({
      where: {
        id: recordId,
      },
      data: {
        status: "delivered",
      },
    });

    return true;
  };

  create = async (data: CreateRecordDto) => {
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
