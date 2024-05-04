import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app.controller";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetDaysResponse } from "../../../../shared/models/responses/getDaysResponse";
import { DayService } from "./day.service";

@Controller("days")
@ApiTags("days")
export class DayController extends AppController {
  constructor(private readonly dayService: DayService) {
    super();
  }

  @Get()
  async getDays(): Promise<BaseResponse<GetDaysResponse[]>> {
    const days = await this.dayService.getDays();
    return this.ok(days);
  }
}
