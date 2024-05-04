import React, { useContext } from "react";
import CourseWeek from "./CourseWeek";
import { GetCohortsResponse } from "../../../shared/models/responses/getCohortsResponse";
import { CohortsContext } from "@/app/contexts/CohortsContext";

const BASE_CLASS = "schedule_table";

export default function ScheduleWeekTable() {
  const { cohorts } = useContext(CohortsContext);
  /* Necessary Data from API
  name: string;
  room: string;
  period: string;
  course: Course[];
  */
  //filtering : cohorts
  const morningCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === "Morning")
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));
  const afternoonCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === "Afternoon")
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));
  const eveningCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === "Evening")
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));
  const weekendCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === "Weekend")
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));

  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_weekheader`}>
          <div></div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thur</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Morning</div>
          <div className="monday">
            {morningCohort.map((cohort, index) => (
              <CourseWeek
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Afternoon</div>
          <div>
            {afternoonCohort.map(
              (cohort, index) => (
                <CourseWeek
                  key={`${cohort.name}-${index}`}
                  schedules={cohort.schedules}
                  name={cohort.name}
                  room={cohort.room}
                />
              )
            )}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Evening</div>
          <div>
            {eveningCohort.map((cohort, index) => (
              <CourseWeek
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Weekend</div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {weekendCohort.map((cohort, index) => (
              <div
                key={`${cohort.name}-${index}`}
                className={`courseWeekend ${cohort.schedules[0].course.color}`}
              >
                {cohort.schedules[0].course.name} / {cohort.name} /{" "}
                {cohort.room}
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
