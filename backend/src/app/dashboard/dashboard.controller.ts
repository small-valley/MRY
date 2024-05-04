import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app.controller";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetDashboardResponse } from "../../../../shared/models/responses/getDashboardResponse";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@ApiTags("dashboard")
export class DashboardController extends AppController {
  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  @Get()
  async getDays(): Promise<BaseResponse<GetDashboardResponse>> {
    const dashboard = await this.dashboardService.getDashboard();
    return this.ok(dashboard);
  }
}
