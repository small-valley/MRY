import { InjectRepository } from "@nestjs/typeorm";
import { IUserCapabilityTimeRepository } from "src/repository/interfaces/IUserCapabilityTimeRepository";
import { Repository } from "typeorm";
import { UserCapabilityTime } from "../entities/user_capability_time.entity";
import { PostUserCapabilityTimeRequest } from "../../../../shared/models/requests/postUserCapabilityTimeRequest";

export class UserCapabilityTimeRepository implements IUserCapabilityTimeRepository {
  constructor(
    @InjectRepository(UserCapabilityTime)
    private userCapabilityTimeRepository: Repository<UserCapabilityTime>,
  ) { }

  async createUserCapabilityTime({ userId, timeId, isDraft }: PostUserCapabilityTimeRequest): Promise<{ userCapabilityTimeId: string }> {
    const userCapabilityTime = new UserCapabilityTime();
    userCapabilityTime.userId = userId;
    userCapabilityTime.timeId = timeId;
    userCapabilityTime.isDraft = isDraft || false;
    await this.userCapabilityTimeRepository.save(userCapabilityTime);
    return { userCapabilityTimeId: userCapabilityTime.id }
  }

  async updateUserCapabilityTime(userCapabilityTimeId: string): Promise<void> {
    const userCapabilityTime = await this.userCapabilityTimeRepository.createQueryBuilder("user_capability_time")
      .where("user_capability_time.id = :id", { id: userCapabilityTimeId })
      .getOne();
    userCapabilityTime.isDraft = false;
    await this.userCapabilityTimeRepository.save(userCapabilityTime);
  }

  async deleteUserCapabilityTime(userCapabilityTimeId: string): Promise<void> {
    const userCapabilityTime = await this.userCapabilityTimeRepository.createQueryBuilder("user_capability_time")
      .where("user_capability_time.id = :id", { id: userCapabilityTimeId })
      .getOne();
    userCapabilityTime.isDraft = false;
    userCapabilityTime.isDeleted = true;
    await this.userCapabilityTimeRepository.save(userCapabilityTime);
  }
}
