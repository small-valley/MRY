import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { SchoolBreakModel } from "src/repository/models/schoolBreak.model";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetSchoolBreaksResponse } from "../../../../shared/models/responses/getSchoolBreaksResponse";
import { PostSchoolBreakDto } from "./dto/postSchoolBreak.dto";
import { SchoolBreakService } from "./schoolBreak.service";

@Controller("school-breaks")
@ApiTags("school-breaks")
@ApiBearerAuth("JWT")
export class SchoolBreakController extends AppController {
  constructor(private readonly schoolBreakService: SchoolBreakService) {
    super();
  }

  @Get()
  async getSchoolBreaks(): Promise<BaseResponse<GetSchoolBreaksResponse[]>> {
    const response = await this.schoolBreakService.getSchoolBreaks();
    return this.ok(response);
  }

  @Post()
  @ApiBody({ type: PostSchoolBreakDto })
  async createSchoolBreak(@Body() request: PostSchoolBreakDto): Promise<BaseResponse<SchoolBreakModel>> {
    const response = await this.schoolBreakService.createSchoolBreak(request);
    return this.ok(response);
  }

  @Delete("/:schoolBreakId")
  async deleteSchoolBreak(@Param("schoolBreakId") schoolBreakId: string): Promise<BaseResponse<void>> {
    await this.schoolBreakService.deleteSchoolBreak(schoolBreakId);
    return this.ok(null);
  }
}
