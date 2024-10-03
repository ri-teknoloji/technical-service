import { Prisma } from "@prisma/client";
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateRecordDto {
  @IsDateString()
  @IsOptional()
  appleWarrantyEndDate: Date;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  estimatedCost: number;

  @IsDateString()
  @IsOptional()
  estimatedDelivery: Date;

  @IsString()
  @IsOptional()
  productImeiNumber?: string;

  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  productSerialNumber?: string;

  @IsArray()
  @IsString({ each: true })
  requiredParts: string[];

  @IsString()
  status: Prisma.ServiceRecordCreateInput["status"];

  @IsString()
  technicianId: string;

  @IsString()
  userId: string;

  @IsDateString()
  @IsOptional()
  warrantyEndDate: Date;
}

export class UpdateRecordDto extends CreateRecordDto {}
