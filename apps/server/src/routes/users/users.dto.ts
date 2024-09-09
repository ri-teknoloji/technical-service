import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber("TR")
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  displayName: string;

  @IsString({ each: true })
  @IsOptional()
  roles: string[];
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsPhoneNumber("TR")
  phoneNumber: string;

  @IsString({ each: true })
  @IsOptional()
  roles: string[];

  @IsString()
  @IsOptional()
  password?: string;
}
