import { UpdateUserAvatarResponse } from "../../../../shared/models/responses/updateUserAvatarResponse";
import { UserModel } from "../models/user.model";

export interface IUserRepository {
  isExistsUserId(userId: string): Promise<boolean>;
  getUsers(): Promise<UserModel[]>;
  getManagers(): Promise<UserModel[]>;
  getUser(userId: string): Promise<UserModel>;
  updateUserAvatar(userId: string, avatarUrl: string): Promise<UpdateUserAvatarResponse>;
  getUserRole(userId: string): Promise<string>;
}
