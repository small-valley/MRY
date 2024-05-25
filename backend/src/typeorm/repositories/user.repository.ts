import { InjectRepository } from "@nestjs/typeorm";
import { IUserRepository } from "src/repository/interfaces/IUserRepository";
import { OauthUserModel, OneUserModel, UserAuthenticationModel, UserModel } from "src/repository/models/user.model";
import { IsNull, Not, Repository } from "typeorm";
import { ContractType } from "../entities/contract_type.entity";
import { Course } from "../entities/course.entity";
import { Day } from "../entities/day.entity";
import { Program } from "../entities/program.entity";
import { Time } from "../entities/time.entity";
import { Role, User } from "../entities/user.entity";
import { UserCapabilityCourse } from "../entities/user_capability_course.entity";
import { UserCapabilityDay } from "../entities/user_capability_day.entity";
import { UserCapabilityTime } from "../entities/user_capability_time.entity";

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async isExistsUserId(userId: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { id: userId, isDeleted: false },
    });
  }

  async getUserById(userId: string): Promise<OneUserModel> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId, isDeleted: false },
    });
    return {
      userId: user.id,
      accessToken: user.accessToken,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  async getLocalUserByEmail(email: string): Promise<UserAuthenticationModel> {
    const user = await this.userRepository.findOne({
      where: { email: email, password: Not(IsNull()) },
    });
    return {
      userId: user?.id,
      email: user?.email,
      role: user?.role,
      password: user?.password,
    } as UserAuthenticationModel;
  }

  async createLocalUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserAuthenticationModel> {
    const user = this.userRepository.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: Role.INSTRUCTOR,
    });
    const newUser = await this.userRepository.save(user);
    return {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
    } as UserAuthenticationModel;
  }

  async deleteAccessToken(userId: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { accessToken: null });
  }

  async upsertOauthUser(user: OauthUserModel): Promise<UserAuthenticationModel> {
    let existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!existingUser) {
      // create a new user as an instructor
      existingUser = this.userRepository.create({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        role: Role.INSTRUCTOR,
      });
    }
    const newUser = await this.userRepository.save(existingUser);
    return {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
    } as UserAuthenticationModel;
  }

  async saveAccessToken(userId: string, accessToken: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { accessToken: accessToken });
  }

  async getUsers() {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndMapMany(
        "user.userCapabilityTimes",
        UserCapabilityTime,
        "userCapabilityTimes",
        "userCapabilityTimes.userId = user.id AND userCapabilityTimes.isDeleted = false AND userCapabilityTimes.isDraft = false"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityDays",
        UserCapabilityDay,
        "userCapabilityDays",
        "userCapabilityDays.userId = user.id AND userCapabilityDays.isDeleted = false AND userCapabilityDays.isDraft = false"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityCourses",
        UserCapabilityCourse,
        "userCapabilityCourses",
        "userCapabilityCourses.userId = user.id AND userCapabilityCourses.isDeleted = false AND userCapabilityCourses.isDraft = false"
      )
      .leftJoinAndMapOne("userCapabilityTimes.time", Time, "time", "userCapabilityTimes.timeId = time.id")
      .leftJoinAndMapOne("userCapabilityDays.day", Day, "day", "userCapabilityDays.dayId = day.id")
      .leftJoinAndMapOne("userCapabilityCourses.course", Course, "course", "userCapabilityCourses.courseId = course.id")
      .leftJoinAndMapOne("course.program", Program, "program", "course.programId = program.id")
      .innerJoinAndMapMany("user.contract", ContractType, "contract", "user.contractTypeId = contract.id")
      .where("user.isDeleted = :isDeleted", { isDeleted: false })
      .select([
        "user.id",
        "user.firstName",
        "user.lastName",
        "user.avatarUrl",
        "user.isActive",
        "contract.name",
        "userCapabilityTimes.id",
        "userCapabilityDays.id",
        "userCapabilityCourses.id",
        "time.id",
        "time.name",
        "course.id",
        "course.name",
        "course.color",
        "program.name",
        "day.id",
        "day.name",
      ])
      .orderBy("user.id", "DESC")
      .getMany();

    return users.map((user) => this.convertToUserModel(user));
  }

  async getManagers() {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndMapMany(
        "user.userCapabilityTimes",
        UserCapabilityTime,
        "userCapabilityTimes",
        "userCapabilityTimes.userId = user.id AND userCapabilityTimes.isDeleted = false AND userCapabilityTimes.isDraft = false"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityDays",
        UserCapabilityDay,
        "userCapabilityDays",
        "userCapabilityDays.userId = user.id AND userCapabilityDays.isDeleted = false AND userCapabilityDays.isDraft = false"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityCourses",
        UserCapabilityCourse,
        "userCapabilityCourses",
        "userCapabilityCourses.userId = user.id AND userCapabilityCourses.isDeleted = false AND userCapabilityCourses.isDraft = false"
      )
      .leftJoinAndMapOne("userCapabilityTimes.time", Time, "time", "userCapabilityTimes.timeId = time.id")
      .leftJoinAndMapOne("userCapabilityDays.day", Day, "day", "userCapabilityDays.dayId = day.id")
      .leftJoinAndMapOne("userCapabilityCourses.course", Course, "course", "userCapabilityCourses.courseId = course.id")
      .leftJoinAndMapOne("course.program", Program, "program", "course.programId = program.id")
      .innerJoinAndMapMany("user.contract", ContractType, "contract", "user.contractTypeId = contract.id")
      .where("user.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("user.role = :role", { role: "manager" })
      .select([
        "user.id",
        "user.firstName",
        "user.lastName",
        "user.avatarUrl",
        "user.isActive",
        "contract.name",
        "userCapabilityTimes.id",
        "userCapabilityDays.id",
        "userCapabilityCourses.id",
        "time.name",
        "course.name",
        "course.color",
        "program.name",
        "day.name",
      ])
      .orderBy("user.id", "DESC")
      .getMany();

    return users.map((user) => this.convertToUserModel(user));
  }

  async getUser(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndMapMany(
        "user.userCapabilityTimes",
        UserCapabilityTime,
        "userCapabilityTimes",
        "userCapabilityTimes.userId = user.id AND userCapabilityTimes.isDeleted = false AND userCapabilityTimes.isDraft = false"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityDays",
        UserCapabilityDay,
        "userCapabilityDays",
        "userCapabilityDays.userId = user.id AND userCapabilityDays.isDeleted = false AND userCapabilityDays.isDraft = false"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityCourses",
        UserCapabilityCourse,
        "userCapabilityCourses",
        "userCapabilityCourses.userId = user.id AND userCapabilityCourses.isDeleted = false AND userCapabilityCourses.isDraft = false"
      )
      .leftJoinAndMapOne("userCapabilityTimes.time", Time, "time", "userCapabilityTimes.timeId = time.id")
      .leftJoinAndMapOne("userCapabilityDays.day", Day, "day", "userCapabilityDays.dayId = day.id")
      .leftJoinAndMapOne("userCapabilityCourses.course", Course, "course", "userCapabilityCourses.courseId = course.id")
      .leftJoinAndMapOne("course.program", Program, "program", "course.programId = program.id")
      .innerJoinAndMapMany("user.contract", ContractType, "contract", "user.contractTypeId = contract.id")
      .where("user.id = :id", { id: userId })
      .andWhere("user.isDeleted = :isDeleted", { isDeleted: false })
      .select([
        "user.id",
        "user.firstName",
        "user.lastName",
        "user.avatarUrl",
        "user.isActive",
        "contract.name",
        "userCapabilityTimes.id",
        "userCapabilityDays.id",
        "userCapabilityCourses.id",
        "time.name",
        "course.name",
        "course.color",
        "program.name",
        "day.name",
      ])
      .getOneOrFail();

    return this.convertToUserModel(user);
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    await this.userRepository.update(userId, { avatarUrl: avatarUrl });
    return { avatarUrl };
  }

  async getUserRole(userId: string): Promise<string> {
    const user = await this.userRepository.findOneOrFail({ where: { id: userId, isDeleted: false }, select: ["role"] });
    return user.role;
  }

  private convertToUserModel(user: User): UserModel {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      // HACK: consider about innerJoinAndMapOne for hourType
      hourType: user.contract[0].name,
      periods: user.userCapabilityTimes.map((userCapabilityTime) => {
        return {
          id: userCapabilityTime.id,
          timeId: userCapabilityTime.time.id,
          name: userCapabilityTime.time.name,
        };
      }),
      capabilities: user.userCapabilityDays.map((userCapabilityDay) => {
        return {
          id: userCapabilityDay.id,
          dayId: userCapabilityDay.day.id,
          name: userCapabilityDay.day.name,
        };
      }),
      courses: user.userCapabilityCourses.map((userCapabilityCourse) => {
        return {
          id: userCapabilityCourse.id,
          courseId: userCapabilityCourse.course.id,
          name: userCapabilityCourse.course.name,
          color: userCapabilityCourse.course.color,
          program: {
            name: userCapabilityCourse.course.program.name,
          },
        };
      }),
    };
  }
}
