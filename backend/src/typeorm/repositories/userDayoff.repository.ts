import { InjectRepository } from "@nestjs/typeorm";
import { IUserDayoffRepository } from "src/repository/interfaces/IUserDayoffRepository";
import { Repository } from "typeorm";
import { UserDayoff } from "../entities/user_dayoff.entity";
import { PostUserDayoffRequest } from "../../../../shared/models/requests/postUserDayoffRequest";

export class UserDayoffRepository implements IUserDayoffRepository {
  constructor(
    @InjectRepository(UserDayoff)
    private userDayoffRepository: Repository<UserDayoff>,
  ) { }

  async getUserDayoff(userId: string) {
    const userDayoffs = await this.userDayoffRepository.createQueryBuilder("user_dayoff")
      .where("user_dayoff.userId = :userId", { userId })
      .andWhere("user_dayoff.isDraft = false")
      .andWhere("user_dayoff.isDeleted = false")
      .select([
        "user_dayoff.id",
        "user_dayoff.startDate",
        "user_dayoff.endDate",
        "user_dayoff.isDraft",
        "user_dayoff.createdAt",
      ])
      .orderBy("user_dayoff.createdAt", "DESC")
      .getMany();

    return userDayoffs;
  }

  async createUserDayoff({ userId, startDate, endDate, isDraft }: PostUserDayoffRequest) {
    const userDayoff = new UserDayoff();
    userDayoff.userId = userId;
    userDayoff.startDate = startDate;
    userDayoff.endDate = endDate;
    userDayoff.isDraft = isDraft || false;
    await this.userDayoffRepository.save(userDayoff);

    return { userDayoffId: userDayoff.id };
  }

  async updateUserDayoff(userDayoffId: string): Promise<void> {
    const userDayoff = await this.userDayoffRepository.createQueryBuilder("user_dayoff")
      .where("user_dayoff.id = :id", { id: userDayoffId })
      .getOne();
    userDayoff.isDraft = false;
    await this.userDayoffRepository.save(userDayoff);
  }

  async deleteUserDayoff(userDayoffId: string): Promise<void> {
    const userDayoff = await this.userDayoffRepository.createQueryBuilder("user_dayoff")
      .where("user_dayoff.id = :id", { id: userDayoffId })
      .getOne();
    userDayoff.isDraft = false;
    userDayoff.isDeleted = true;
    await this.userDayoffRepository.save(userDayoff);
  }
}
