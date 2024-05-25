import { UpdateUserAvatarResponse } from "../../../../shared/models/responses/updateUserAvatarResponse";
import { OauthUserModel, OneUserModel, UserAuthenticationModel, UserModel } from "../models/user.model";

export interface IUserRepository {
  isExistsUserId(userId: string): Promise<boolean>;
  getUserById(userId: string): Promise<OneUserModel | null>;
  getLocalUserByEmail(email: string): Promise<UserAuthenticationModel>;
  createLocalUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserAuthenticationModel>;
  deleteAccessToken(userId: string): Promise<void>;
  upsertOauthUser(user: OauthUserModel): Promise<UserAuthenticationModel>;
  saveAccessToken(userId: string, accessToken: string): Promise<void>;
  getUsers(): Promise<UserModel[]>;
  getManagers(): Promise<UserModel[]>;
  getUser(userId: string): Promise<UserModel>;
  updateUserAvatar(userId: string, avatarUrl: string): Promise<UpdateUserAvatarResponse>;
  getUserRole(userId: string): Promise<string>;
}
