import { AvailableInstructorModel, AvailableRoomModel } from "../models/availableInstructor.model";

export interface IAvailabilityRepository {
  getAvailableInstructors(scheduleId: string): Promise<AvailableInstructorModel[]>;
  getAvailableRooms(scheduleId: string): Promise<AvailableRoomModel[]>;
}
