import { Inject, Injectable } from "@nestjs/common";
import { IUserCapabilityDayRepository } from "src/repository/interfaces/IUserCapabilityDayRepository";

@Injectable()
export class UserCapabilityDayService {
  @Inject("userCapabilityDayRepository")
  private readonly userCapabilityDayRepository: IUserCapabilityDayRepository;

  async createUserCapabilityDay({ userId, dayId, isDraft }): Promise<void> {
    await this.userCapabilityDayRepository.createUserCapabilityDay({ userId, dayId, isDraft });
  }

  async updateUserCapabilityDay(userCapabilityDayId: string): Promise<void> {
    await this.userCapabilityDayRepository.updateUserCapabilityDay(userCapabilityDayId);
  }

  async deleteUserCapabilityDay(userCapabilityDayId: string): Promise<void> {
    await this.userCapabilityDayRepository.deleteUserCapabilityDay(userCapabilityDayId);
  }
}
