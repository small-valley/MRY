import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "src/repository/interfaces/IUserRepository";
import { OneUserModel } from "src/repository/models/user.model";
import { GetInstructorResponse } from "../../../../shared/models/responses/getInstructorResponse";
import { UpdateUserAvatarResponse } from "../../../../shared/models/responses/updateUserAvatarResponse";

@Injectable()
export class UserService {
  @Inject("userRepository")
  private readonly userRepository: IUserRepository;

  async isExistsUserId(userId: string): Promise<void | never> {
    const isExistsUserId = await this.userRepository.isExistsUserId(userId);
    if (!isExistsUserId) {
      throw new Error(`User id: ${userId} does not exist`);
    }
  }

  async getUsers(): Promise<GetInstructorResponse[]> {
    const response = await this.userRepository.getUsers();
    return response;
  }

  async getManagers(): Promise<GetInstructorResponse[]> {
    const response = await this.userRepository.getManagers();
    return response;
  }

  async getUser(userId: string): Promise<GetInstructorResponse> {
    const response = await this.userRepository.getUser(userId);
    return response;
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<UpdateUserAvatarResponse> {
    const response = await this.userRepository.updateUserAvatar(userId, avatarUrl);
    return response;
  }

  async getLoginUser(userId: string): Promise<Omit<OneUserModel, "accessToken">> {
    const user = await this.userRepository.getUserById(userId);
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }
}
