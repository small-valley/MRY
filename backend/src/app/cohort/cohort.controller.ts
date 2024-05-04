import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app.controller";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetRecentCohortResponse } from "../../../../shared/models/responses/getRecentCohortResponse";
import { PostCohortResponse } from "../../../../shared/models/responses/postCohortResponse";
import { CohortService } from "./cohort.service";
import { PostCohortDto } from "./dto/postCohort.dto";

@Controller("cohorts")
@ApiTags("cohorts")
export class CohortController extends AppController {
  constructor(private readonly cohortService: CohortService) {
    super();
  }

  @Get()
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  async getCohorts(@Query("startDate") startDate?: string, @Query("endDate") endDate?: string) {
    const result = await this.cohortService.getCohorts({ startDate, endDate });
    return this.ok(result);
  }

  @Get("/:cohortId")
  async getCohort(@Param("cohortId") cohortId: string) {
    const result = await this.cohortService.getCohort(cohortId);
    return this.ok(result);
  }

  @Get("recent/:programId")
  async getRecentCohort(@Param("programId") programId: string): Promise<BaseResponse<GetRecentCohortResponse[]>> {
    const result = await this.cohortService.getRecentCohort(programId);
    return this.ok(result);
  }

  @Post()
  @ApiBody({ type: PostCohortDto })
  async create(@Body() request: PostCohortDto): Promise<BaseResponse<PostCohortResponse>> {
    const newCohortId = await this.cohortService.createCohort(request);
    return this.ok({ cohortId: newCohortId });
  }
}
