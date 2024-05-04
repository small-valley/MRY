import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "src/repository/models/user.model";
import { Repository } from "typeorm";
import { ContractType } from "../entities/contract_type.entity";
import { Course } from "../entities/course.entity";
import { Day } from "../entities/day.entity";
import { Program } from "../entities/program.entity";
import { Time } from "../entities/time.entity";
import { User } from "../entities/user.entity";
import { UserCapabilityCourse } from "../entities/user_capability_course.entity";
import { UserCapabilityDay } from "../entities/user_capability_day.entity";
import { UserCapabilityTime } from "../entities/user_capability_time.entity";

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async isExistsUserId(userId: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { id: userId, isDeleted: false },
    });
  }

  async getUsers() {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndMapMany(
        "user.userCapabilityTimes",
        UserCapabilityTime,
        "userCapabilityTimes",
        "userCapabilityTimes.userId = user.id"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityDays",
        UserCapabilityDay,
        "userCapabilityDays",
        "userCapabilityDays.userId = user.id"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityCourses",
        UserCapabilityCourse,
        "userCapabilityCourses",
        "userCapabilityCourses.userId = user.id"
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

  async getManagers() {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndMapMany(
        "user.userCapabilityTimes",
        UserCapabilityTime,
        "userCapabilityTimes",
        "userCapabilityTimes.userId = user.id"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityDays",
        UserCapabilityDay,
        "userCapabilityDays",
        "userCapabilityDays.userId = user.id"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityCourses",
        UserCapabilityCourse,
        "userCapabilityCourses",
        "userCapabilityCourses.userId = user.id"
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
        "userCapabilityTimes.userId = user.id"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityDays",
        UserCapabilityDay,
        "userCapabilityDays",
        "userCapabilityDays.userId = user.id"
      )
      .leftJoinAndMapMany(
        "user.userCapabilityCourses",
        UserCapabilityCourse,
        "userCapabilityCourses",
        "userCapabilityCourses.userId = user.id"
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
  }

  async getUserRole(userId: string): Promise<string> {
    const user = await this.userRepository.findOneOrFail({ where: { id: userId, isDeleted: false }, select: ["role"] });
    return user.role;
  }

  private convertToUserModel(user: User): UserModel {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      // HACK: consider about innerJoinAndMapOne for hourType
      hourType: user.contract[0].name,
      periods: user.userCapabilityTimes.map((userCapabilityTime) => {
        return {
          name: userCapabilityTime.time.name,
        };
      }),
      capabilities: user.userCapabilityDays.map((userCapabilityDay) => {
        return {
          name: userCapabilityDay.day.name,
        };
      }),
      courses: user.userCapabilityCourses.map((userCapabilityCourse) => {
        return {
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
