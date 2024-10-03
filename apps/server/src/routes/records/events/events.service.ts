import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { NetgsmService } from "@/netgsm";
import { PrismaService } from "@/prisma";

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private netgsm: NetgsmService
  ) {}

  async create(
    recordId: string,
    body: Omit<Prisma.EventCreateInput, "serviceRecordId">
  ) {
    const model = await this.prisma.event.create({
      data: {
        ...body,
        serviceRecordId: recordId,
      },
    });

    const record = await this.prisma.serviceRecord.findUnique({
      where: {
        id: recordId,
      },
    });

    if (!record) {
      throw new BadRequestException("Record not found");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: record.userId,
      },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Send SMS
    if (user.phoneNumber) {
      await this.netgsm.sendSMS(user.phoneNumber, {
        context: {
          event: body.title,
          productName: record.productName,
          trackingNumber: record.trackingNumber,
        },
        template: "event-created",
      });
    }

    return model;
  }

  async find(recordId: string) {
    const models = await this.prisma.event.findMany({
      where: {
        serviceRecordId: recordId,
      },
    });
    return models;
  }

  async findOne(recordId: string, eventId: string) {
    const model = await this.prisma.event.findUnique({
      where: {
        id: eventId,
        serviceRecordId: recordId,
      },
    });
    return model;
  }

  async remove(recordId: string, eventId: string) {
    const model = await this.prisma.event.delete({
      where: {
        id: eventId,
        serviceRecordId: recordId,
      },
    });
    return model;
  }

  async update(
    recordId: string,
    eventId: string,
    body: Omit<Prisma.EventUpdateInput, "serviceRecordId">
  ) {
    const model = await this.prisma.event.update({
      data: body,
      where: {
        id: eventId,
        serviceRecordId: recordId,
      },
    });
    return model;
  }
}
