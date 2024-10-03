import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  username: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty({
    example: "test@example.com",
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber("TR")
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;
}
