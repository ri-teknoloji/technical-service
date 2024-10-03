import { Prisma } from "@prisma/client";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsPhoneNumber("TR")
  phoneNumber: string;

  @IsString({ each: true })
  roles: Prisma.UserCreateInput["roles"];

  @IsString()
  @IsOptional()
  username?: string;
}

export class UpdateUserDto extends CreateUserDto {}
