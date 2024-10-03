import { IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  description: string;

  @IsString()
  title: string;
}

export class UpdateEventDto extends CreateEventDto {}
