import { PrismaService } from "@/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  find = async (recordId: string) => {
    const models = await this.prisma.event.findMany({
      where: {
        serviceRecordId: recordId,
      },
    });
    return models;
  };

  findOne = async (recordId: string, eventId: string) => {
    const model = await this.prisma.event.findUnique({
      where: {
        id: eventId,
        serviceRecordId: recordId,
      },
      include: {
        ServiceRecord: true,
      },
    });
    return model;
  };

  create = async (
    recordId,
    body: Omit<Prisma.EventCreateInput, "ServiceRecord">
  ) => {
    const model = await this.prisma.event.create({
      data: {
        ...body,
        serviceRecordId: recordId,
      },
    });
    return model;
  };

  update = async (
    recordId: string,
    eventId: string,
    body: Omit<Prisma.EventUpdateInput, "ServiceRecord">
  ) => {
    const model = await this.prisma.event.update({
      where: {
        id: eventId,
        serviceRecordId: recordId,
      },
      data: body,
    });
    return model;
  };

  remove = async (recordId: string, eventId: string) => {
    const model = await this.prisma.event.delete({
      where: {
        id: eventId,
        serviceRecordId: recordId,
      },
    });
    return model;
  };
}
