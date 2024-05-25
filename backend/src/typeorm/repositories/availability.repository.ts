import { InjectRepository } from "@nestjs/typeorm";
import { Availability } from "src/repository/enums/availability.enum";
import { IAvailabilityRepository } from "src/repository/interfaces/IAvailabilityRepository";
import { Repository } from "typeorm";
import { HourType } from "../entities/contract_type.entity";
import { ProgramUser } from "../entities/program_user.entity";
import { Room } from "../entities/room.entity";
import { Schedule } from "../entities/schedule.entity";
import { Role, User } from "../entities/user.entity";

export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(ProgramUser)
    private readonly programUserRepository: Repository<ProgramUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {}

  async getAvailableInstructors(scheduleId: string) {
    //HACK: setParameters() method inside nested queries are not working?
    // Temporary solution is to replace the scheduleId manually
    return this.userRepository.query(
      `
      (${this.getEligibleInstructors(scheduleId).getQuery()})
      UNION
      (${this.getPreferenceInstructors(scheduleId).getQuery()})
      UNION
      ${this.getUnAvailableInstructors(scheduleId)}
      `.replaceAll(":scheduleId", `'${scheduleId.replaceAll("'", "")}'`)
    );
  }

  getUnAvailableInstructors(scheduleId: string): string {
    return `
      (${this.getOverTimeUserQuery(scheduleId)})
      UNION
      (${this.getOutOfCapabilityTimeUserQuery(scheduleId).getQuery()})
      UNION
      (${this.getOutOfCapabilityDayUserQuery(scheduleId).getQuery()})
      UNION
      (${this.getOutOfCapabilityCourseUserQuery(scheduleId).getQuery()})
      UNION
      (${this.getOverlappingScheduleUserQuery(scheduleId).getQuery()})
      UNION
      (${this.getDayOffUserQuery(scheduleId)})`;
  }

  async getAvailableRooms(scheduleId: string) {
    const availableRoomsQuery = this.roomRepository
      .createQueryBuilder("room")
      .where(
        `room.id NOT IN(
            SELECT s.room_id FROM (
              ${this.getTakenRoomIds(scheduleId).getQuery()}
            ) s
            WHERE s.room_id IS NOT NULL
        )`
      )
      .andWhere(
        `CASE WHEN EXISTS (${this.getRoomIdFromScheduleQuery(scheduleId, "sRoomId").andWhere("sRoomId.room_id IS NOT NULL").getQuery()})
        THEN room.id NOT IN (${this.getRoomIdFromScheduleQuery(scheduleId, "sRoomId").getQuery()})
        ELSE 1 = 1 END`
      )
      .andWhere("room.is_deleted = false")
      .select(["room.id AS id", "room.name AS name", "room.floor AS floor"]);

    const availableRooms = await this.roomRepository.query(
      `(${availableRoomsQuery.getQuery()}) UNION (${this.getOnlineRoom().getQuery()})`.replaceAll(
        ":scheduleId",
        `'${scheduleId.replaceAll("'", "")}'`
      )
    );
    return availableRooms;
  }

  /**
   * Get eligible instructors for the given scheduleId
   * "eligible instructors" means instructors who has the possibility to charge the given schedule, not means the availability
   * The availability is calculated by unavailable instructors later
   **/
  getEligibleInstructors(scheduleId: string) {
    return this.getEligibleUserIdsQuery(scheduleId)
      .innerJoin("users", "u", "pu.user_id = u.id")
      .select([`'${Availability.ELIGIBLE}' AS availability`, "u.id AS user_id", "u.avatar_url", "u.first_name"]);
  }

  getPreferenceInstructors(scheduleId: string) {
    return this.getEligibleUserIdsQuery(scheduleId)
      .innerJoin("user_capability_courses", "ucc", "pu.user_id = ucc.user_id")
      .innerJoin("users", "u", "pu.user_id = u.id")
      .where(
        `ucc.course_id IN (${this.getScheduleQuery(scheduleId, "s").select("course_id").distinct(true).getQuery()})`
      )
      .andWhere(
        `CASE WHEN EXISTS (${this.getUserIdFromScheduleQuery(scheduleId, "sProgramId").andWhere("sProgramId.userId IS NOT NULL").getQuery()})
          THEN ucc.user_id NOT IN (${this.getUserIdFromScheduleQuery(scheduleId, "sProgramId").getQuery()})
          ELSE 1 = 1 END`
      )
      .andWhere("ucc.is_draft = false")
      .andWhere("ucc.is_preference = true")
      .andWhere("ucc.is_deleted = false")
      .select([
        `'${Availability.PREFERENCE_COURSE}' AS availability`,
        "u.id AS user_id",
        "u.avatar_url",
        "u.first_name",
      ]);
  }

  getScheduleQuery(scheduleId: string, alias: string) {
    return this.scheduleRepository
      .createQueryBuilder(alias)
      .innerJoin(`cohorts`, `${alias}c`, `${alias}c.id = ${alias}.cohort_id`)
      .where(`${alias}.id = :scheduleId`, { scheduleId })
      .andWhere(`${alias}.is_deleted = false`)
      .select([
        `${alias}.id`,
        `${alias}.user_id`,
        `${alias}.course_id`,
        `${alias}.start_date`,
        `${alias}.end_date`,
        `${alias}c.time_id`,
        `${alias}c.program_id`,
        `${alias}.day_id`,
        `${alias}.room_id`,
      ]);
  }

  getUserIdFromScheduleQuery(scheduleId: string, alias: string) {
    return this.getScheduleQuery(scheduleId, alias).select(`${alias}.user_id`).take(1);
  }

  getProgramIdFromScheduleQuery(scheduleId: string, alias: string) {
    return this.getScheduleQuery(scheduleId, alias).select(`${alias}c.program_id`).take(1);
  }

  getTimeIdFromScheduleQuery(scheduleId: string, alias: string) {
    return this.getScheduleQuery(scheduleId, alias).select(`${alias}c.time_id`).take(1);
  }

  getRoomIdFromScheduleQuery(scheduleId: string, alias: string) {
    return this.getScheduleQuery(scheduleId, alias).select(`${alias}.room_id`).take(1);
  }

  getTakenRoomIds(scheduleId: string) {
    return this.getEligibleSchedulesQuery(scheduleId, true).select("schedule.room_id").distinct(true);
  }

  getOnlineRoom() {
    return this.roomRepository.createQueryBuilder("online").where("name = 'Online'").select(["id", "name", "floor"]);
  }

  /**
   * Get eligible user ids for the given scheduleId
   * "eligible user" means users who are belong to the same program as the instructor of the given schedule
   * @param scheduleId
   **/
  getEligibleUserIdsQuery(scheduleId: string) {
    return (
      this.programUserRepository
        .createQueryBuilder("pu")
        .innerJoin("users", "ou", "ou.id = pu.user_id")
        .where(`pu.program_id IN (${this.getProgramIdFromScheduleQuery(scheduleId, "pEligible").getQuery()})`)
        // exclude the instructor who charges the given schedule
        // if the schedule is not assigned to any instructor, then ignore this condition
        .andWhere(
          `CASE WHEN EXISTS (${this.getUserIdFromScheduleQuery(scheduleId, "sProgramId").andWhere("sProgramId.userId IS NOT NULL").getQuery()})
            THEN pu.user_id NOT IN (${this.getUserIdFromScheduleQuery(scheduleId, "sProgramId").getQuery()})
            ELSE 1 = 1 END`
        )
        .andWhere(`ou.role = '${Role.INSTRUCTOR}'`)
        .andWhere("ou.is_active = true")
        .andWhere("ou.is_deleted = false")
        .select(["pu.user_id"])
        .distinct(true)
    );
  }

  /**
   * Get eligible schedules for the given scheduleId
   * "eligible schedules" means schedules which are supposed to be considered when calculating the availability
   * @param scheduleId
   **/
  getEligibleSchedulesQuery(scheduleId: string, isRoomAvailability: boolean = false) {
    return (
      this.scheduleRepository
        .createQueryBuilder("schedule")
        .innerJoin(
          `(${this.getScheduleQuery(scheduleId, "schedule").getQuery()})`,
          "ss",
          "schedule.id <> ss.schedule_id"
        )
        // whether the start or end date are overlapping with that of given schedule
        .where(
          `(schedule.start_date <= ss.start_date AND ss.start_date <= schedule.end_date)
        OR (schedule.start_date <= ss.end_date AND ss.end_date <= schedule.end_date)
        OR (ss.start_date <= schedule.start_date AND schedule.end_date <= ss.end_date)`
        )
        // whether the schedules are belong to the same program (only adding condition when calculating available instructors)
        .andWhere(
          isRoomAvailability ? "1 = 1" : `schedule.user_id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`
        )
        .andWhere("schedule.is_deleted = false")
        .setParameters(this.getEligibleUserIdsQuery(scheduleId).getParameters())
        .setParameters(this.getScheduleQuery(scheduleId, "schedule").getParameters())
        .select(["schedule.id", "schedule.user_id", "schedule.cohort_id", "schedule.day_id", "schedule.room_id"])
    );
  }

  getTotalHoursQuery(scheduleId: string) {
    return (
      this.userRepository
        .createQueryBuilder("u")
        .innerJoin("contract_types", "ct", "u.contract_type_id = ct.id AND ct.is_deleted = false")
        .innerJoin(`(${this.getEligibleSchedulesQuery(scheduleId).getQuery()})`, "es", "es.user_id = u.id")
        .innerJoin("days", "day", "es.day_id = day.id AND day.is_deleted = false")
        .select(["u.*", "day.hours_per_week", "ct.maxHoursPerWeek"])
        // exclude the instructor who charges the given schedule
        .where(`u.id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`)
    );
  }

  getOverTimeUserFullQuery(scheduleId: string) {
    const query = this.getTotalHoursQuery(scheduleId)
      .andWhere(`ct.name = '${HourType.FULL}'`)
      .groupBy("u.id")
      .having("SUM(day.hours_per_week) >= MAX(ct.maxHoursPerWeek)")
      .select([`'${Availability.OVERTIME_FULL}' AS availability`, "u.id AS user_id", "u.avatar_url", "u.first_name"]);
    return query;
  }

  getOverTimeUserPartQuery(scheduleId: string) {
    return this.getTotalHoursQuery(scheduleId)
      .andWhere(`ct.name = '${HourType.PART}'`)
      .groupBy("u.id")
      .having("SUM(day.hours_per_week) >= MAX(ct.maxHoursPerWeek)")
      .select([`'${Availability.OVERTIME_PART}' AS availability`, "u.id AS user_id", "u.avatar_url", "u.first_name"]);
  }

  getOverTimeUserQuery(scheduleId: string): string {
    return `${this.getOverTimeUserFullQuery(scheduleId).getQuery()}
      UNION
      ${this.getOverTimeUserPartQuery(scheduleId).getQuery()}`;
  }

  getOutOfCapabilityTimeUserQuery(scheduleId: string) {
    const timeEligibleUsers = this.userRepository
      .createQueryBuilder("ute")
      .innerJoin(
        "user_capability_times",
        "uct",
        "ute.id = uct.user_id AND uct.is_draft = false AND uct.is_deleted = false"
      )
      .where(`uct.time_id IN (${this.getTimeIdFromScheduleQuery(scheduleId, "tEligible").getQuery()})`)
      .andWhere(`ute.id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`)
      .select("ute.id");

    return this.userRepository
      .createQueryBuilder("u")
      .where(`u.id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`)
      .andWhere(`u.id NOT IN (${timeEligibleUsers.getQuery()})`)
      .select([
        `'${Availability.OUT_OF_CAPABILITY_TIME}' AS availability`,
        "u.id AS user_id",
        "u.avatar_url",
        "u.first_name",
      ]);
  }

  getOutOfCapabilityDayUserQuery(scheduleId: string) {
    return this.getScheduleQuery(scheduleId, "s")
      .innerJoin("users", "u", "s.user_id <> u.id")
      .leftJoin(
        "user_capability_days",
        "ucd",
        "s.day_id = ucd.day_id AND u.id = ucd.user_id AND ucd.is_draft = false AND ucd.is_deleted = false"
      )
      .where(`u.id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`)
      .andWhere("ucd.id IS NULL")
      .andWhere("u.is_active = true")
      .andWhere("u.is_deleted = false")
      .select([
        `'${Availability.OUT_OF_CAPABILITY_DAY}' AS availability`,
        "u.id AS user_id",
        "u.avatar_url",
        "u.first_name",
      ])
      .distinct(true);
  }

  getOutOfCapabilityCourseUserQuery(scheduleId: string) {
    return this.userRepository
      .createQueryBuilder("ou")
      .where(
        `ou.id NOT IN (${this.userRepository
          .createQueryBuilder("u")
          .innerJoin(
            "user_capability_courses",
            "ucc",
            "u.id = ucc.user_id AND ucc.is_draft = false AND ucc.is_deleted = false AND ucc.is_preference = false"
          )
          .where(`ucc.course_id IN (${this.getScheduleQuery(scheduleId, "s").select("course_id").getQuery()})`)
          .select("u.id")
          .getQuery()})`
      )
      .andWhere(`ou.id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`)
      .andWhere("ou.is_active = true")
      .andWhere("ou.is_deleted = false")
      .select([
        `'${Availability.OUT_OF_CAPABILITY_COURSE}' AS availability`,
        "ou.id AS user_id",
        "ou.avatar_url",
        "ou.first_name",
      ])
      .setParameters(this.getScheduleQuery(scheduleId, "s").getParameters())
      .setParameters(this.getEligibleUserIdsQuery(scheduleId).getParameters());
  }

  getDayOffUserQuery(scheduleId: string): string {
    return `
    SELECT
      '${Availability.IN_DAYOFF}' AS availability,
      tu.id AS user_id,
      tu.avatar_url,
      tu.first_name
    FROM (${this.userRepository
      .createQueryBuilder("u")
      .innerJoin("user_dayoffs", "udo", "u.id = udo.user_id")
      .where(`u.id IN (${this.getEligibleUserIdsQuery(scheduleId).getQuery()})`)
      .andWhere("u.is_active = true")
      .andWhere("u.is_deleted = false")
      .andWhere("udo.is_draft = false")
      .andWhere("udo.is_deleted = false")
      .select(["u.id AS id", "u.avatar_url", "u.first_name", "udo.start_date", "udo.end_date"])
      .getQuery()}) AS tu
    INNER JOIN
    (${this.getScheduleQuery(scheduleId, "s").select(["s.start_date", "s.end_date"]).distinct(true).getQuery()}) AS td
    ON TRUE -- cross join tables
    WHERE (td.start_date <= tu.start_date AND tu.start_date <= td.end_date)
     OR (td.start_date <= tu.end_date AND tu.end_date <= td.end_date)
     OR (tu.start_date <= td.start_date AND td.end_date <= tu.end_date)`;
  }

  getOverlappingScheduleUserQuery(scheduleId: string) {
    //  whether the days are the same and the time is overlapping
    return (
      this.scheduleRepository
        .createQueryBuilder("schedule")
        .innerJoin("cohorts", "c", "c.id = schedule.cohort_id AND c.is_deleted = false")
        .innerJoin("times", "t", "c.time_id = t.id AND t.is_deleted = false")
        .innerJoin(
          `(${this.getEligibleSchedulesQuery(scheduleId)
            .innerJoin("cohorts", "tc", "tc.id = schedule.cohort_id AND tc.is_deleted = false")
            .innerJoin("times", "tt", "tc.time_id = tt.id AND tt.is_deleted = false")
            .innerJoin(
              "users",
              "tu",
              `tu.id = schedule.user_id AND tu.role = '${Role.INSTRUCTOR}' AND tu.is_active = true AND tu.is_deleted = false`
            )
            .select("schedule.day_id, tt.start_time, tt.end_time, tu.id, tu.avatar_url, tu.first_name")
            .getQuery()})`,
          "tsd",
          "tsd.day_id = schedule.day_id"
        )
        .where("schedule.id = :scheduleId", { scheduleId })
        .andWhere("schedule.is_deleted = false")
        .andWhere(
          `schedule.day_id = tsd.day_id AND
      ((t.start_time <= tsd.start_time AND tsd.start_time <= t.end_time)
      OR (t.start_time <= tsd.end_time AND tsd.end_time <= t.end_time)
      OR (tsd.start_time <= t.start_time AND t.end_time <= tsd.end_time))`
        )
        // exclude the instructor who charges the given schedule
        .andWhere(
          `CASE WHEN EXISTS (${this.getUserIdFromScheduleQuery(scheduleId, "os").andWhere("os.userId IS NOT NULL").getQuery()})
            THEN tsd.id NOT IN (${this.getUserIdFromScheduleQuery(scheduleId, "os").getQuery()})
            ELSE 1 = 1 END`
        )
        .select([
          `'${Availability.OVERLAPPING_SCHEDULE}' AS availability`,
          "tsd.id AS user_id",
          "tsd.avatar_url",
          "tsd.first_name",
        ])
    );
  }
}
