import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { GetAvailabilityResponse } from "../../../../shared/models/responses/getAvailabilityResponse";
import { TodoService } from "../todo/todo.service";
import { AvailabilityService } from "./availability.service";

@Controller("availability")
@ApiTags("availability")
@ApiBearerAuth("JWT")
export class AvailabilityController extends AppController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly todoService: TodoService
  ) {
    super();
  }

  @Get("/:scheduleId")
  async getAvailabilityAndTodos(@Param("scheduleId") scheduleId: string) {
    const availableInstructors = await this.availabilityService.getAvailableInstructors(scheduleId);
    const availableRooms = await this.availabilityService.getAvailableRooms(scheduleId);
    const todos = await this.todoService.getTodosByScheduleId(scheduleId);
    return this.ok({
      availableInstructors: availableInstructors,
      availableRooms: availableRooms,
      todos: todos,
    } as GetAvailabilityResponse);
  }
}
