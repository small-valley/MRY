import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { CourseService } from "../course/course.service";
import { PostCoursesDto, PostProgramDto } from "./dto/postProgram.dto";
import { PutCourseDto, PutProgramDto } from "./dto/putProgram.dto";
import { ProgramService } from "./program.service";

@Controller("programs")
@ApiTags("programs")
@ApiBearerAuth("JWT")
export class ProgramController extends AppController {
  constructor(
    private readonly programService: ProgramService,
    private readonly courseService: CourseService
  ) {
    super();
  }

  @Get()
  async findAll() {
    const programs = await this.programService.findAll();
    return this.ok(programs);
  }

  @Post()
  @ApiBody({ type: PostProgramDto })
  async create(@Body() request: PostProgramDto) {
    await this.programService.create(request);
    return this.created();
  }

  @Post("/courses")
  @ApiBody({ type: PostCoursesDto })
  async createCourses(@Body() request: PostCoursesDto) {
    await this.programService.createCourses(request);
    return this.created();
  }

  @Put()
  @ApiBody({ type: PutProgramDto })
  async updateProgram(@Body() request: PutProgramDto) {
    await this.programService.updateProgram(request);
    return this.ok(null);
  }

  @Put("/courses")
  @ApiBody({ type: PutCourseDto })
  async updateCourse(@Body() request: PutCourseDto) {
    await this.courseService.updateCourse(request);
    return this.ok(null);
  }

  @Delete("/courses/:courseId")
  async deleteCourse(@Param("courseId") courseId: string) {
    await this.courseService.deleteCourse(courseId);
    return this.ok(null);
  }

  @Delete("/:id")
  async deleteProgram(@Param("id") id: string) {
    await this.programService.deleteProgram(id);
    return this.ok(null);
  }
}
