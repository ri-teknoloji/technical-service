import { Prisma } from "@prisma/client";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber("TR")
  phoneNumber: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  displayName: string;

  @IsString({ each: true })
  @IsOptional()
  roles: Prisma.UserCreateInput["roles"][];
}

export class UpdateUserDto extends CreateUserDto {}
