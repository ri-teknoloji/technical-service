import { Prisma } from "@prisma/client";
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateRecordDto {
  @IsString()
  userId: string;

  @IsString()
  technicianId: string;

  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  productImeiNumber?: string;

  @IsString()
  @IsOptional()
  productSerialNumber?: string;

  @IsString()
  description: string;

  @IsString()
  status: Prisma.ServiceRecordCreateInput["status"];

  @IsNumber()
  @Min(0)
  estimatedCost: number;

  @IsDateString()
  estimatedDelivery: Date;

  @IsString({ each: true })
  requiredParts: string[];
}

export class UpdateRecordDto extends CreateRecordDto {}
