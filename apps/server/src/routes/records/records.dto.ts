import { IsNotEmpty, IsString } from "class-validator";

export class CreateRecordDto {
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  status: string;
}

export class UpdateRecordDto {
  @IsString()
  productName: string;

  @IsString()
  userId: string;

  @IsString()
  status: string;
}
