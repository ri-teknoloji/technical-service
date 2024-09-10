import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRecordDto {
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  description: string;

  @IsString()
  status: Prisma.ServiceRecordCreateInput["status"];
}

export class UpdateRecordDto {
  @IsString()
  productName: string;

  @IsString()
  userId: string;

  @IsString()
  description: string;

  @IsString()
  status: Prisma.ServiceRecordCreateInput["status"];
}
