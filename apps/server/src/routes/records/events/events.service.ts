import { Injectable } from "@nestjs/common";
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
    body: Omit<Prisma.EventCreateInput, "ServiceRecord">
  ) {
    const model = await this.prisma.event.create({
      data: {
        ...body,
        serviceRecordId: recordId,
      },
    });

    const record = await this.prisma.serviceRecord.findUnique({
      include: {
        User: true,
      },
      where: {
        id: recordId,
      },
    });

    // Send SMS
    if (record && record.User && record.User.phoneNumber) {
      await this.netgsm.sendSMS(record.User.phoneNumber, {
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
      include: {
        ServiceRecord: true,
      },
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
    body: Omit<Prisma.EventUpdateInput, "ServiceRecord">
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
