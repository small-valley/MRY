import { InjectRepository } from "@nestjs/typeorm";
import { IUserCapabilityDayRepository } from "src/repository/interfaces/IUserCapabilityDayRepository";
import { Repository } from "typeorm";
import { UserCapabilityDay } from "../entities/user_capability_day.entity";
import { PostUserCapabilityDayRequest } from "../../../../shared/models/requests/postUserCapabilityDayRequest";

export class UserCapabilityDayRepository implements IUserCapabilityDayRepository {
  constructor(
    @InjectRepository(UserCapabilityDay)
    private userCapabilityDayRepository: Repository<UserCapabilityDay>,
  ) { }

  async createUserCapabilityDay({ userId, dayId, isDraft }: PostUserCapabilityDayRequest): Promise<{userCapabilityDayId: string}> {
    const userCapabilityDay = new UserCapabilityDay();
    userCapabilityDay.userId = userId;
    userCapabilityDay.dayId = dayId;
    userCapabilityDay.isDraft = isDraft || false;
    await this.userCapabilityDayRepository.save(userCapabilityDay);
    return { userCapabilityDayId:  userCapabilityDay.id }
  }

  async updateUserCapabilityDay(userCapabilityDayId: string): Promise<void> {
    const userCapabilityDay = await this.userCapabilityDayRepository.createQueryBuilder("user_capability_day")
      .where("user_capability_day.id = :id", { id: userCapabilityDayId })
      .getOne();
    userCapabilityDay.isDraft = false;
    await this.userCapabilityDayRepository.save(userCapabilityDay);
  }

  async deleteUserCapabilityDay(userCapabilityDayId: string): Promise<void> {
    const userCapabilityDay = await this.userCapabilityDayRepository.createQueryBuilder("user_capability_day")
      .where("user_capability_day.id = :id", { id: userCapabilityDayId })
      .getOne();
    userCapabilityDay.isDraft = false;
    userCapabilityDay.isDeleted = true;
    await this.userCapabilityDayRepository.save(userCapabilityDay);
  }
}
