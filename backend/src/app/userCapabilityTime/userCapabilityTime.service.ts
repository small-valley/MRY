import { Inject, Injectable } from "@nestjs/common";
import { IUserCapabilityTimeRepository } from "src/repository/interfaces/IUserCapabilityTimeRepository";

@Injectable()
export class UserCapabilityTimeService {
  @Inject("userCapabilityTimeRepository")
  private readonly userCapabilityTimeRepository: IUserCapabilityTimeRepository;

  async createUserCapabilityTime({ userId, timeId, isDraft }): Promise<void> {
    await this.userCapabilityTimeRepository.createUserCapabilityTime({ userId, timeId, isDraft });
  }

  async updateUserCapabilityTime(userCapabilityTimeId: string): Promise<void> {
    await this.userCapabilityTimeRepository.updateUserCapabilityTime(userCapabilityTimeId);
  }

  async deleteUserCapabilityTime(userCapabilityTimeId: string): Promise<void> {
    await this.userCapabilityTimeRepository.deleteUserCapabilityTime(userCapabilityTimeId);
  }
}
