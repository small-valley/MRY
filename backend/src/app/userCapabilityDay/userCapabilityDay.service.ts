import { Inject, Injectable } from "@nestjs/common";
import { IUserCapabilityDayRepository } from "src/repository/interfaces/IUserCapabilityDayRepository";

@Injectable()
export class UserCapabilityDayService {
  @Inject("userCapabilityDayRepository")
  private readonly userCapabilityDayRepository: IUserCapabilityDayRepository;

  async createUserCapabilityDay({ userId, dayId, isDraft }): Promise<{ userCapabilityDayId: string }> {
    const response = await this.userCapabilityDayRepository.createUserCapabilityDay({ userId, dayId, isDraft });
    return response;
  }

  async updateUserCapabilityDay(userCapabilityDayId: string): Promise<void> {
    await this.userCapabilityDayRepository.updateUserCapabilityDay(userCapabilityDayId);
  }

  async deleteUserCapabilityDay(userCapabilityDayId: string): Promise<void> {
    await this.userCapabilityDayRepository.deleteUserCapabilityDay(userCapabilityDayId);
  }
}
