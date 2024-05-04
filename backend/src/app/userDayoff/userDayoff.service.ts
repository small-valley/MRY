import { Inject, Injectable } from "@nestjs/common";
import { IUserDayoffRepository } from "src/repository/interfaces/IUserDayoffRepository";

@Injectable()
export class UserDayoffService {
  @Inject("userDayoffRepository")
  private readonly userDayoffRepository: IUserDayoffRepository;

  async getUserDayoff(userId: string) {
    const response = await this.userDayoffRepository.getUserDayoff(userId);
    return response;
  }

  async createUserDayoff({ userId, startDate, endDate, isDraft }) {
    const response = await this.userDayoffRepository.createUserDayoff({ userId, startDate, endDate, isDraft });
    return response;
  }

  async updateUserDayoff(userDayoffId: string): Promise<void> {
    await this.userDayoffRepository.updateUserDayoff(userDayoffId);
  }

  async deleteUserDayoff(userDayoffId: string): Promise<void> {
    await this.userDayoffRepository.deleteUserDayoff(userDayoffId);
  }
}
