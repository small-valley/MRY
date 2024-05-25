import { InjectRepository } from "@nestjs/typeorm";
import { IUserCapabilityCourseRepository } from "src/repository/interfaces/IUserCapabilityCourseRepository";
import { Repository } from "typeorm";
import { UserCapabilityCourse } from "../entities/user_capability_course.entity";
import { PostUserCapabilityCourseRequest } from "../../../../shared/models/requests/postUserCapabilityCourseRequest";

export class UserCapabilityCourseRepository implements IUserCapabilityCourseRepository {
  constructor(
    @InjectRepository(UserCapabilityCourse)
    private userCapabilityCourseRepository: Repository<UserCapabilityCourse>,
  ) { }

  async createUserCapabilityCourse({ userId, courseId, isPreference, isDraft }: PostUserCapabilityCourseRequest): Promise<{userCapabilityCourseId: string}> {
    const userCapabilityCourse = new UserCapabilityCourse();
    userCapabilityCourse.userId = userId;
    userCapabilityCourse.courseId = courseId;
    userCapabilityCourse.isPreference = isPreference || false;
    userCapabilityCourse.isDraft = isDraft || false;
    await this.userCapabilityCourseRepository.save(userCapabilityCourse);
    return { userCapabilityCourseId:  userCapabilityCourse.id }
  }

  async updateUserCapabilityCourse(userCapabilityCourseId: string): Promise<void> {
    const userCapabilityCourse = await this.userCapabilityCourseRepository.createQueryBuilder("user_capability_course")
      .where("user_capability_course.id = :id", { id: userCapabilityCourseId })
      .getOne();
    userCapabilityCourse.isDraft = false;
    await this.userCapabilityCourseRepository.save(userCapabilityCourse);
  }

  async deleteUserCapabilityCourse(userCapabilityCourseId: string): Promise<void> {
    const userCapabilityCourse = await this.userCapabilityCourseRepository.createQueryBuilder("user_capability_course")
      .where("user_capability_course.id = :id", { id: userCapabilityCourseId })
      .getOne();
    userCapabilityCourse.isDraft = false;
    userCapabilityCourse.isDeleted = true;
    await this.userCapabilityCourseRepository.save(userCapabilityCourse);
  }
}
