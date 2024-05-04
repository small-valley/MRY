import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app.controller";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetPeriodsResponse } from "../../../../shared/models/responses/getPeriodsResponse";
import { TimeService } from "./time.service";

@Controller("periods")
@ApiTags("periods")
export class TimeController extends AppController {
  constructor(private readonly timeService: TimeService) {
    super();
  }

  @Get()
  async getTimes(): Promise<BaseResponse<GetPeriodsResponse[]>> {
    const periods = await this.timeService.getTimes();
    return this.ok(periods);
  }
}
