import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { UserAuthGuard } from "src/auth/auth/guard/user.guard";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetDashboardResponse } from "../../../../shared/models/responses/getDashboardResponse";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@ApiTags("dashboard")
@ApiBearerAuth("JWT")
export class DashboardController extends AppController {
  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  @UseGuards(UserAuthGuard)
  @Get()
  async getDays(@Req() req): Promise<BaseResponse<GetDashboardResponse>> {
    const dashboard = await this.dashboardService.getDashboard(req.user.userId, req.user.role);
    return this.ok(dashboard);
  }
}
