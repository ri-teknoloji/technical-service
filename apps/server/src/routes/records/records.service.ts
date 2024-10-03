import { Injectable, NotFoundException } from "@nestjs/common";

import { NetgsmService } from "@/netgsm";
import { PrismaService } from "@/prisma";
import { generateTrackingNumber } from "@/utils";

import { CreateRecordDto, UpdateRecordDto } from "./records.dto";

@Injectable()
export class RecordsService {
  private deliverCodes = new Map<string, string>();

  constructor(
    private prisma: PrismaService,
    private netgsm: NetgsmService
  ) {}

  async create(data: CreateRecordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new NotFoundException("Kullanıcı bulunamadı.");
    }

    const trackingNumber = generateTrackingNumber();

    const record = await this.prisma.serviceRecord.create({
      data: {
        ...data,
        trackingNumber,
      },
    });

    // Send SMS
    if (user.phoneNumber) {
      await this.netgsm.sendSMS(user.phoneNumber, {
        context: {
          name: user.displayName,
          productName: data.productName,
          trackingNumber,
        },
        template: "record-created",
      });
    }

    return record;
  }

  async find() {
    const records = await this.prisma.serviceRecord.findMany();
    return records;
  }

  async findOne(id: string) {
    const record = await this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    return record;
  }

  async getCode(id: string) {
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

    await this.netgsm.sendSMS(user.phoneNumber, {
      context: {
        code,
        productName: record.productName,
      },
      template: "record-delivery-code",
    });

    return true;
  }

  async remove(id: string) {
    const isExist = await this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    return this.prisma.serviceRecord.delete({
      include: {
        events: true,
      },
      where: {
        id,
      },
    });
  }

  async search(query: string) {
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
  }

  async update(id: string, data: UpdateRecordDto) {
    const isExist = await this.prisma.serviceRecord.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) {
      throw new NotFoundException("Servis kaydı bulunamadı.");
    }

    const record = await this.prisma.serviceRecord.update({
      data,
      where: {
        id,
      },
    });

    return record;
  }

  async verifyCode(recordId: string, code: string) {
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
      data: {
        status: "delivered",
      },
      where: {
        id: recordId,
      },
    });

    return true;
  }
}
