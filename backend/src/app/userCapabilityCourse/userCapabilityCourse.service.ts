import { Inject, Injectable } from "@nestjs/common";
import { IUserCapabilityCourseRepository } from "src/repository/interfaces/IUserCapabilityCourseRepository";

@Injectable()
export class UserCapabilityCourseService {
  @Inject("userCapabilityCourseRepository")
  private readonly userCapabilityCourseRepository: IUserCapabilityCourseRepository;

  async createUserCapabilityCourse({ userId, courseId, isPreference, isDraft }): Promise<void> {
    await this.userCapabilityCourseRepository.createUserCapabilityCourse({ userId, courseId, isPreference, isDraft });
  }

  async updateUserCapabilityCourse(userCapabilityCourseId: string): Promise<void> {
    await this.userCapabilityCourseRepository.updateUserCapabilityCourse(userCapabilityCourseId);
  }

  async deleteUserCapabilityCourse(userCapabilityCourseId: string): Promise<void> {
    await this.userCapabilityCourseRepository.deleteUserCapabilityCourse(userCapabilityCourseId);
  }
}
