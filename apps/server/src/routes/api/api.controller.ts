import { Controller, Get } from "@nestjs/common";

@Controller()
export class ApiController {
  constructor() {}

  @Get()
  index() {
    return {
      status: 200,
      message: "API is running",
    };
  }
}
