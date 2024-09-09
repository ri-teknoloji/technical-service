import { Controller, Get } from "@nestjs/common";

@Controller()
export class ApiController {
  @Get()
  index() {
    return {
      status: 200,
      message: "API is running",
    };
  }
}
