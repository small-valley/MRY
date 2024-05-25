import { Inject, Injectable } from "@nestjs/common";
import { Availability } from "src/repository/enums/availability.enum";
import { IAvailabilityRepository } from "src/repository/interfaces/IAvailabilityRepository";
import { AvailableInstructorModel } from "src/repository/models/availableInstructor.model";
import {
  AvailableInstructors,
  AvailableRooms,
  Instructor,
} from "../../../../shared/models/responses/getAvailabilityResponse";

@Injectable()
export class AvailabilityService {
  @Inject("availabilityRepository")
  private readonly availabilityRepository: IAvailabilityRepository;

  async getAvailableInstructors(scheduleId: string): Promise<AvailableInstructors> {
    const instructors = await this.availabilityRepository.getAvailableInstructors(scheduleId);

    const unavailableInstructors = this.extractUnavailableInstructors(instructors);

    return {
      availableInstructors: this.extractAvailableInstructorsByAvailability(
        instructors,
        unavailableInstructors,
        Availability.ELIGIBLE
      ),
      availableInstructorsPreference: this.extractAvailableInstructorsByAvailability(
        instructors,
        unavailableInstructors,
        Availability.PREFERENCE_COURSE
      ),
      unavailableInstructors: unavailableInstructors,
    };
  }

  async getAvailableRooms(scheduleId: string): Promise<AvailableRooms[]> {
    return (await this.availabilityRepository.getAvailableRooms(scheduleId)).sort((a, b) => {
      return a.name < b.name ? -1 : a.name > a.name ? 1 : 0;
    });
  }

  extractUnavailableInstructors(instructors: AvailableInstructorModel[]): Instructor[] {
    const processedIds = new Set();
    return (
      instructors
        .filter((instructor) => {
          return (
            instructor.availability !== Availability.ELIGIBLE &&
            instructor.availability !== Availability.PREFERENCE_COURSE
          );
        })
        // Remove duplicates
        .filter((instructor) => {
          if (!processedIds.has(instructor.user_id)) {
            processedIds.add(instructor.user_id);
            return true;
          }
          return false;
        })
        .map((instructor) => ({
          id: instructor.user_id,
          avatarUrl: instructor.avatar_url,
          firstName: instructor.first_name,
        }))
        // sort by first name alphabetically
        .sort((a, b) => {
          return a.firstName < b.firstName ? -1 : a.firstName > a.firstName ? 1 : 0;
        })
    );
  }

  extractAvailableInstructorsByAvailability(
    instructors: AvailableInstructorModel[],
    unavailableInstructors: Instructor[],
    availability: Availability
  ): Instructor[] {
    return (
      instructors
        .filter(
          (instructor) =>
            instructor.availability === availability &&
            !unavailableInstructors.map((un) => un.id).includes(instructor.user_id)
        )
        .map((instructor) => ({
          id: instructor.user_id,
          avatarUrl: instructor.avatar_url,
          firstName: instructor.first_name,
        }))
        // sort by first name alphabetically
        .sort((a, b) => {
          return a.firstName < b.firstName ? -1 : a.firstName > a.firstName ? 1 : 0;
        })
    );
  }
}
