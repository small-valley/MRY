import React, { useContext } from "react";
import { getBaseDate, getCoursesByBaseDate } from "@/app/actions/common";
import CourseMonth from "./CourseMonth";
import { CohortsContext } from "@/app/contexts/CohortsContext";

const BASE_CLASS = "schedule_table";

export default function ScheduleMonthTable() {
  const { cohorts } = useContext(CohortsContext);
  /* Necessary Data from API
  program: string;
  name: string;
  room: string;
  period: string;
  course: Course[];
  */
  /* Necessary data from filter
  1. first day of month with year
  2. startday : 1 - monday, 2- tuesday, 3- wed;...
  3. days of month : jan - 31, Feb - 28 or 29 ,,,,
  */
  // cohort list by month
  const month = "2023-11-01";
  const startDay = 3; //wedsday
  const days = 30;
  const baseDate = getBaseDate(month, startDay, days);
  const cnt_week = Math.ceil((days + startDay - 1) / 7);

  const coursesByBaseDate = cohorts
    ? getCoursesByBaseDate(cohorts, baseDate)
    : [];
  /*  baseDate: string;
  name: string;
  period: string;
  room: string;
  course: Course2[]; */
  const week1 = coursesByBaseDate.filter(
    (item) => item.baseDate === baseDate[0]
  );
  const week2 = coursesByBaseDate.filter(
    (item) => item.baseDate === baseDate[1]
  );
  const week3 = coursesByBaseDate.filter(
    (item) => item.baseDate === baseDate[2]
  );
  const week4 = coursesByBaseDate.filter(
    (item) => item.baseDate === baseDate[3]
  );
  const week5 = coursesByBaseDate.filter(
    (item) => item.baseDate === baseDate[4]
  );
  const week6 = coursesByBaseDate.filter(
    (item) => item.baseDate === baseDate[5]
  );

  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_monthheader`}>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thur</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div className="monday">
            {week1.map((cohort, index) => (
              <CourseMonth
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
                period={cohort.period}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {week1.map((cohort, index) => (
              <div key={`${cohort.name}-${index}`}>
                {cohort.period === "weekend" ? (
                  <div className={`courseWeekend ${cohort.period}`}>
                    {cohort.schedules.map((obj) => (
                      <div key={`${cohort.name}-${index}-${obj.id}`}>
                        {obj.course.name}
                      </div>
                    ))}
                    {cohort.schedules[0].course.name}/ {cohort.name}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>
            {week2.map((cohort, index) => (
              <CourseMonth
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
                period={cohort.period}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {week2.map((cohort, index) => (
              <div key={`${cohort.name}-${index}`}>
                {cohort.period === "weekend" ? (
                  <div>
                    <div className={`courseWeekend ${cohort.period}`}>
                      {cohort.schedules.map((obj) => (
                        <div key={`${cohort.name}-${index}-${obj.id}`}>
                          {obj.course.name}
                        </div>
                      ))}
                      {cohort.schedules[0].course.name}/ {cohort.name}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>
            {week3.map((cohort, index) => (
              <CourseMonth
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
                period={cohort.period}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {week3.map((cohort, index) => (
              <div key={`${cohort.name}-${index}`}>
                {cohort.period === "weekend" ? (
                  <div>
                    <div className={`courseWeekend ${cohort.period}`}>
                      {cohort.schedules.map((obj) => (
                        <div key={`${cohort.name}-${index}-${obj.id}`}>
                          {obj.course.name}
                        </div>
                      ))}
                      {cohort.schedules[0].course.name}/ {cohort.name}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>
            {week4.map((cohort, index) => (
              <CourseMonth
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
                period={cohort.period}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {week4.map((cohort, index) => (
              <div key={`${cohort.name}-${index}`}>
                {cohort.period === "weekend" ? (
                  <div>
                    <div className={`courseWeekend ${cohort.period}`}>
                      {cohort.schedules.map((obj) => (
                        <div key={`${cohort.name}-${index}-${obj.id}`}>
                          {obj.course.name}
                        </div>
                      ))}
                      {cohort.schedules[0].course.name}/ {cohort.name}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>
            {week5.map((cohort, index) => (
              <CourseMonth
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
                period={cohort.period}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {week5.map((cohort, index) => (
              <div key={`${cohort.name}-${index}`}>
                {cohort.period === "weekend" ? (
                  <div>
                    <div className={`courseWeekend ${cohort.period}`}>
                      {cohort.schedules.map((obj) => (
                        <div key={`${cohort.name}-${index}-${obj.id}`}>
                          {obj.course.name}
                        </div>
                      ))}
                      {cohort.schedules[0].course.name}/ {cohort.name}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div></div>
        </div>
        {cnt_week > 5 ? (
          <>
            <div className={`${BASE_CLASS}_monthcontent`}>
              <div>
                {week6.map((cohort, index) => (
                  <CourseMonth
                    key={`${cohort.name}-${index}`}
                    schedules={cohort.schedules}
                    name={cohort.name}
                    room={cohort.room}
                    period={cohort.period}
                  />
                ))}
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div>
                {week6.map((cohort, index) => (
                  <div key={`${cohort.name}-${index}`}>
                    {cohort.period === "weekend" ? (
                      <div>
                        <div className={`courseWeekend ${cohort.period}`}>
                          {cohort.schedules.map((obj) => (
                            <div key={`${cohort.name}-${index}-${obj.id}`}>
                              {obj.course.name}
                            </div>
                          ))}
                          {cohort.schedules[0].course.name}/ {cohort.name}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
              <div></div>
            </div>
          </>
        ) : (
          <> </>
        )}
      </div>
    </>
  );
}
