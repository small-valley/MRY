import { config } from "dotenv";
import { Client } from "pg";

import { DMACourses } from "./DMACourses";
import { DMSCourses } from "./DMSCourses";
import { cohorts } from "./cohorts";
import { contractTypes } from "./contract_types";
import { days } from "./days";
import { notifications } from "./notifications";
import { presetTodos } from "./preset_todos";
import { programs } from "./programs";
import { rooms } from "./rooms";
import { times } from "./times";
import { users } from "./users";

config({ path: "../../.env" });

const DB_NAME: string = process.env.POSTGRE_DATABASE_NAME || "test";
const DB_USER: string = process.env.POSTGRE_DATABASE_USER_NAME || "";
const DB_HOST: string = process.env.POSTGRE_DATABASE_HOST || "localhost";
const DB_PASSWORD: string = process.env.POSTGRE_DATABASE_PASSWORD || "";
const DB_PORT: number = parseInt(process.env.POSTGRE_DATABASE_PORT || "5432");

async function seedDatabase() {
  const client = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
  });

  try {
    await client.connect();

    const createdBy = "system";
    const updatedBy = "system";
    let dmaProgramId = "";
    let dmsProgramId = "";

    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`);

    if (res.rowCount !== 0) {
      console.log(`${DB_NAME} database exists, seeding it.`);

      await client.query("BEGIN");

      // Days
      days.forEach(async (day) => {
        await client.query(
          `INSERT INTO days (name, hours_per_week, start_day_of_week, end_day_of_week, created_by, updated_by) VALUES ('${day.name}', '${day.hoursPerWeek}', '${day.startDayOfWeek}', '${day.endDayOfWeek}', '${createdBy}', '${updatedBy}');`
        );
      });

      // HACK: Implement overlappable_days if needed
      //OverlappableDays
      // const monToWed = await client.query(`SELECT id FROM days WHERE name = 'Monday - Wednesday';`);
      // const monToWedDayId = monToWed.rows[0].id;
      // const wedToFri = await client.query(`SELECT id FROM days WHERE name = 'Wednesday - Friday';`);
      // const wedToFriDayId = wedToFri.rows[0].id;
      // await client.query(
      //   `INSERT INTO overlappable_days (day_id, overlappable_day_id, created_by, updated_by) VALUES ($1, $2, $3, $4);`,
      //   [monToWedDayId, wedToFriDayId, createdBy, updatedBy]
      // );

      // await client.query(
      //   `INSERT INTO overlappable_days (day_id, overlappable_day_id, created_by, updated_by) VALUES ($1, $2, $3, $4);`,
      //   [wedToFriDayId, monToWedDayId, createdBy, updatedBy]
      // );

      // Times
      times.forEach(async (time) => {
        await client.query(
          `INSERT INTO times (name, start_time, end_time, created_by, updated_by) VALUES ('${time.name}', '${time.start_time}', '${time.end_time}', '${createdBy}', '${updatedBy}');`
        );
      });

      // Rooms
      rooms.forEach(async (room) => {
        await client.query(
          `INSERT INTO rooms (name, floor, capacity, created_by, updated_by) VALUES ($1, $2, $3, $4, $5);`,
          [room.name, room.floor, room.capacity, createdBy, updatedBy]
        );
      });

      // Programs
      programs.forEach(async (program) => {
        await client.query(
          `INSERT INTO programs (name, created_by, updated_by) VALUES ('${program.name}', '${createdBy}', '${updatedBy}');`
        );
      });

      // Courses
      const DMA = await client.query(`SELECT id FROM programs WHERE name = 'DMA';`);
      dmaProgramId = DMA.rows[0].id;

      const DMS = await client.query(`SELECT id FROM programs WHERE name = 'DMS';`);
      dmsProgramId = DMS.rows[0].id;

      await Promise.all(
        DMSCourses.map(async (course) => {
          await client.query(
            `INSERT INTO courses (name, program_id, color, hour, created_by, updated_by) VALUES ('${course.name}', '${dmsProgramId}', '${course.color}', '${course.hour}', '${createdBy}', '${updatedBy}');`
          );
        })
      );

      await Promise.all(
        DMACourses.map(async (course) => {
          await client.query(
            `INSERT INTO courses (name, program_id, color, hour, created_by, updated_by) VALUES ('${course.name}', '${dmaProgramId}', '${course.color}', '${course.hour}', '${createdBy}', '${updatedBy}');`
          );
        })
      );

      // ContractTypes
      await Promise.all(
        contractTypes.map(async (contractType) => {
          await client.query(
            `INSERT INTO contract_types (name, min_hours_per_week, max_hours_per_week, created_by, updated_by) VALUES ('${contractType.name}', ${contractType.minHoursPerWeek}, ${contractType.maxHoursPerWeek}, '${createdBy}', '${updatedBy}');`
          );
        })
      );

      // Users
      const contractTypesData = await client.query(`SELECT id FROM contract_types ORDER BY max_hours_per_week ASC;`);
      const fullTimeContractTypeId = contractTypesData.rows[1].id;
      const partTimeContractTypeId = contractTypesData.rows[0].id;
      const contractContractTypeId = contractTypesData.rows[2].id;

      await Promise.all(
        users.map(async (user) => {
          const contractTypeId =
            user.hourType === "full"
              ? fullTimeContractTypeId
              : user.hourType === "part"
                ? partTimeContractTypeId
                : contractContractTypeId;
          const userData = await client.query(
            `INSERT INTO users (email, first_name, last_name, password, avatar_url, contract_type_id, is_active, role, created_by, updated_by) VALUES ('${user.email}', '${user.firstName}', '${user.lastName}', '${user.password}', '${user.avatarUrl}', '${contractTypeId}', '${user.isActive}', '${user.role}', '${createdBy}', '${updatedBy}') RETURNING id;`
          );
          const userId = userData.rows[0].id;

          await Promise.all(
            user.userCapabilityCourses.map(async (course) => {
              const courseData = await client.query(`SELECT id FROM courses WHERE name = '${course}';`);

              const courseId = courseData.rows[0].id;

              await client.query(
                `INSERT INTO user_capability_courses (user_id, course_id, created_by, updated_by) VALUES ('${userId}', '${courseId}', '${createdBy}', '${updatedBy}');`
              );

              await client.query(
                `INSERT INTO user_capability_courses (user_id, course_id, is_preference, created_by, updated_by) VALUES ('${userId}', '${courseId}', 'true', '${createdBy}', '${updatedBy}');`
              );
            })
          );

          await Promise.all(
            user.userCapabilityDays.map(async (day) => {
              const dayData = await client.query(`SELECT id FROM days WHERE name = '${day}';`);
              const dayId = dayData.rows[0]?.id;

              if (dayId) {
                await client.query(
                  `INSERT INTO user_capability_days (user_id, day_id, created_by, updated_by) VALUES ('${userId}', '${dayId}', '${createdBy}', '${updatedBy}');`
                );
              }
            })
          );

          await Promise.all(
            user.userCapabilityTimes.map(async (time) => {
              const timeData = await client.query(`SELECT id FROM times WHERE name = '${time}';`);
              const timeId = timeData.rows[0].id;

              await client.query(
                `INSERT INTO user_capability_times (user_id, time_id, created_by, updated_by) VALUES ('${userId}', '${timeId}', '${createdBy}', '${updatedBy}');`
              );
            })
          );

          await Promise.all(
            user.userPrograms.map(async (program) => {
              const programId = program === "DMA" ? dmaProgramId : dmsProgramId;
              await client.query(
                `INSERT INTO program_users (program_id, user_id, created_by, updated_by) VALUES ('${programId}', '${userId}', '${createdBy}', '${updatedBy}');`
              );
            })
          );
        })
      );

      // Cohorts and schedules
      await Promise.all(
        cohorts.map(async (cohort) => {
          const programId = cohort.program === "DMA" ? dmaProgramId : dmsProgramId;

          const time = await client.query(`SELECT id FROM times WHERE name = '${cohort.time}';`);
          const timeId = time.rows[0].id;

          const room = await client.query(`SELECT id FROM rooms WHERE name = '${cohort.room}';`);
          const roomId = room.rows[0].id;

          await client.query(
            `INSERT INTO cohorts (name, program_id, time_id, intake, student_count, created_by, updated_by) VALUES ('${cohort.name}', '${programId}', '${timeId}', '${cohort.intake}', '${cohort.studentCount}', '${createdBy}', '${updatedBy}');`
          );

          const cohortId = await client.query(`SELECT id FROM cohorts WHERE name = '${cohort.name}';`);

          const day = await client.query(`SELECT id FROM days ORDER BY name ASC;`);
          const monToFriDayId = day.rows[0].id;
          const monToWedDayId = day.rows[1].id;
          const wedToFriDayId = day.rows[2].id;

          await Promise.all(
            cohort.schedules.map(async (schedule) => {
              const course = await client.query(
                `SELECT c.id From courses c INNER JOIN programs p ON c.program_id = p.id WHERE p.name = '${cohort.program}' AND c.name = '${schedule.course}';`
              );
              const courseId = course.rows[0].id;

              const user = await client.query(`SELECT id FROM users WHERE first_name = '${schedule.instructor}';`);
              let userId = user.rows[0]?.id;
              userId = userId ? `'${userId}'` : null;

              const dayId =
                schedule.days === "Monday - Friday"
                  ? monToFriDayId
                  : schedule.days === "Monday - Wednesday"
                    ? monToWedDayId
                    : wedToFriDayId;

              await client.query(
                `INSERT INTO schedules (course_id, cohort_id, user_id, room_id, day_id, start_date, end_date, created_by, updated_by) VALUES ('${courseId}', '${cohortId.rows[0].id}', ${userId}, '${roomId}', '${dayId}', '${schedule.startDate}', '${schedule.endDate}', '${createdBy}', '${updatedBy}') RETURNING id;`
              );
            })
          );

          // delete room_id and day_id of break course
          await client.query(
            `UPDATE schedules SET room_id = null, day_id = null WHERE course_id IN (SELECT id FROM courses WHERE name = 'Break');`
          );
        })
      );

      // Todos
      await Promise.all(
        presetTodos.map(async (todo) => {
          await client.query(
            `INSERT INTO preset_todos (title, description, created_by, updated_by) VALUES ('${todo.title}', '${todo.description}', '${createdBy}', '${updatedBy}');`
          );
          await client.query(
            `INSERT INTO todos (schedule_id, title, description, due_date, is_completed, created_by, updated_by) SELECT id, '${todo.title}', '${todo.description}', start_date, false, '${createdBy}', '${updatedBy}' FROM schedules;`
          );
        })
      );

      // Notifications
      await Promise.all(
        notifications.map(async (notification) => {
          const sender = await client.query(`SELECT id FROM users WHERE first_name = '${notification.senderName}';`);
          const senderId = sender.rows[0].id;

          const receiver = await client.query(
            `SELECT id FROM users WHERE first_name = '${notification.receiverName}';`
          );
          const receiverId = receiver.rows[0].id;

          let description = "";
          switch (notification.type) {
            case "vacation":
              const startDate = new Date("2024-5-01").toISOString().split("T")[0];
              const endDate = new Date("2024-05-15").toISOString().split("T")[0];
              description = `${startDate} - ${endDate}`;
              await client.query(
                `INSERT INTO user_dayoffs (user_id, start_date, end_date, created_by, updated_by) VALUES ('${receiverId}', '${startDate}', '${endDate}', '${createdBy}', '${updatedBy}');`
              );
              const userDayoff = await client.query(
                `SELECT id FROM user_dayoffs WHERE user_id = '${receiverId}' AND start_date = '${startDate}' AND end_date = '${endDate}';`
              );
              const userDayoffId = userDayoff.rows[0].id;
              await client.query(
                `INSERT INTO notifications(sender_id, receiver_id, title, description, is_read, link_url, type, created_by, updated_by, user_dayoff_id) VALUES('${senderId}', '${receiverId}', '${notification.title}', '${description}', '${notification.isRead}', '${notification.linkUrl}', '${notification.type}', '${createdBy}', '${updatedBy}', '${userDayoffId}'); `
              );
              break;
            case "course":
              const course = await client.query(`SELECT id FROM courses WHERE name = '${notification.courseName}';`);
              const courseId = course.rows[0].id;
              description = "updates available courses";
              await client.query(
                `INSERT INTO user_capability_courses (user_id, course_id, created_by, updated_by) VALUES ('${receiverId}', '${courseId}', '${createdBy}', '${updatedBy}');`
              );
              const userCapabilityCourse = await client.query(
                `SELECT id FROM user_capability_courses WHERE user_id = '${receiverId}' AND course_id = '${courseId}';`
              );
              const userCapabilityCourseId = userCapabilityCourse.rows[0].id;
              await client.query(
                `INSERT INTO notifications(sender_id, receiver_id, title, description, is_read, link_url, type, created_by, updated_by, user_capability_course_id) VALUES('${senderId}', '${receiverId}', '${notification.title}', '${description}', '${notification.isRead}', '${notification.linkUrl}', '${notification.type}', '${createdBy}', '${updatedBy}', '${userCapabilityCourseId}'); `
              );
              break;
            case "day":
              const day = await client.query(`SELECT id FROM days WHERE name = '${notification.dayName}';`);
              const dayId = day.rows[0].id;
              description = "updates available days";
              await client.query(
                `INSERT INTO user_capability_days (user_id, day_id, created_by, updated_by) VALUES ('${receiverId}', '${dayId}', '${createdBy}', '${updatedBy}');`
              );
              const userCapabilityDay = await client.query(
                `SELECT id FROM user_capability_days WHERE user_id = '${receiverId}' AND day_id = '${dayId}';`
              );
              const userCapabilityDayId = userCapabilityDay.rows[0].id;
              await client.query(
                `INSERT INTO notifications(sender_id, receiver_id, title, description, is_read, link_url, type, created_by, updated_by, user_capability_day_id) VALUES('${senderId}', '${receiverId}', '${notification.title}', '${description}', '${notification.isRead}', '${notification.linkUrl}', '${notification.type}', '${createdBy}', '${updatedBy}', '${userCapabilityDayId}'); `
              );
              break;
            case "time":
              const time = await client.query(`SELECT id FROM times WHERE name = '${notification.timeName}';`);
              const timeId = time.rows[0].id;
              description = "updates available times";
              await client.query(
                `INSERT INTO user_capability_times (user_id, time_id, created_by, updated_by) VALUES ('${receiverId}', '${timeId}', '${createdBy}', '${updatedBy}');`
              );
              const userCapabilityTime = await client.query(
                `SELECT id FROM user_capability_times WHERE user_id = '${receiverId}' AND time_id = '${timeId}';`
              );
              const userCapabilityTimeId = userCapabilityTime.rows[0].id;
              await client.query(
                `INSERT INTO notifications(sender_id, receiver_id, title, description, is_read, link_url, type, created_by, updated_by, user_capability_time_id) VALUES('${senderId}', '${receiverId}', '${notification.title}', '${description}', '${notification.isRead}', '${notification.linkUrl}', '${notification.type}', '${createdBy}', '${updatedBy}', '${userCapabilityTimeId}'); `
              );
              break;
            case "message":
              description = notification.description!;
              await client.query(
                `INSERT INTO notifications(sender_id, receiver_id, title, description, is_read, link_url, type, created_by, updated_by) VALUES('${senderId}', '${receiverId}', '${notification.title}', '${description}', '${notification.isRead}', '${notification.linkUrl}', '${notification.type}', '${createdBy}', '${updatedBy}'); `
              );
              break;
            default:
              break;
          }
        })
      );

      await client.query("COMMIT");
      console.log(`seeded database ${DB_NAME}.`);
    } else {
      console.log(`${DB_NAME} database not found.Please create it first.`);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
  } finally {
    await client.end();
  }
}

seedDatabase();
