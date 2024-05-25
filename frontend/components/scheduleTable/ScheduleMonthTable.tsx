import React, { useContext, useEffect, useState } from 'react';
import { changeDate, getBaseDate, getCoursesByBaseDate } from '@/app/actions/common';
import CourseMonth from './CourseMonth';
import { CohortsContext } from '@/app/contexts/CohortsContext';
import { CalendarCheck, ChevronLeft, ChevronRight, ConstructionIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { returnMonthlyCohort } from '@/type/course';

const BASE_CLASS = 'schedule_table';
const BTN_BASE_CLASS = 'schedule_btn';

export default function ScheduleMonthTable() {
  const { cohorts } = useContext(CohortsContext);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [startDay, setStartDay] = useState<number>(0);
  const [baseDate, setBaseDate] = useState<string[]>([]);
  const [days, setDays] = useState<number>(0);
  const [coursesByBaseDate, setCoursesByBaseDate] = useState<returnMonthlyCohort[]>();
  const cnt_week = Math.ceil((days + startDay - 1) / 7);
  const [weekOne, setWeekOne] = useState<returnMonthlyCohort[]>();
  const [weekTwo, setWeekTwo] = useState<returnMonthlyCohort[]>();
  const [weekThree, setWeekThree] = useState<returnMonthlyCohort[]>();
  const [weekFour, setWeekFour] = useState<returnMonthlyCohort[]>();
  const [weekFive, setWeekFive] = useState<returnMonthlyCohort[]>();
  const [weekSix, setWeekSix] = useState<returnMonthlyCohort[]>();

  useEffect(() => {
    //set today
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 12));
    setSelectedDate(utcDate);
  }, []);

  useEffect(() => {
    const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    setDays(lastDayOfMonth);
    setStartDay(selectedDate.getDay());
  }, [selectedDate]);

  useEffect(() => {
    setBaseDate(getBaseDate(selectedDate, startDay, 31));
  }, [startDay, days]);

  useEffect(() => {
    setCoursesByBaseDate(getCoursesByBaseDate(cohorts, baseDate));
  }, [baseDate]);
  useEffect(() => {
    if (!coursesByBaseDate) return;
    const week1 = coursesByBaseDate.filter((item) => item.baseDate === baseDate[0]);
    const week2 = coursesByBaseDate.filter((item) => item.baseDate === baseDate[1]);
    const week3 = coursesByBaseDate.filter((item) => item.baseDate === baseDate[2]);
    const week4 = coursesByBaseDate.filter((item) => item.baseDate === baseDate[3]);
    const week5 = coursesByBaseDate.filter((item) => item.baseDate === baseDate[4]);
    const week6 = coursesByBaseDate.filter((item) => item.baseDate === baseDate[5]);
    setWeekOne(week1);
    setWeekTwo(week2);
    setWeekThree(week3);
    setWeekFour(week4);
    setWeekFive(week5);
    setWeekSix(week6);
  }, [coursesByBaseDate]);
  const handleDateChange = (date: Date) => {
    setIsCalandar(false);
    setSelectedDate(date);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const handlePreveMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() - 1);
    setSelectedDate(nextMonth);
  };

  return (
    <>
      <div className={`${BASE_CLASS}_listfilter`}>
        <div className={`${BASE_CLASS}_listfilter_first`}>
          <button className={`${BTN_BASE_CLASS}_trans`} onClick={handlePreveMonth}>
            <ChevronLeft />
          </button>
          <button
            className={`${BASE_CLASS}_listfilter_first_btn`}
            onClick={() => (isCalandar ? setIsCalandar(false) : setIsCalandar(true))}
          >
            <CalendarCheck />
            <h2>
              {selectedDate && selectedDate.getFullYear()} - {selectedDate && selectedDate.getMonth() + 1}
            </h2>
          </button>

          <button className={`${BTN_BASE_CLASS}_trans`} onClick={handleNextMonth}>
            <ChevronRight />
          </button>
        </div>
        <div className={`init_calendarlist ${isCalandar ? 'calender_list' : ''}`}>
          <div className="calender_list_wrap">
            <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="MM/yyyy" showMonthYearPicker />
          </div>
        </div>
      </div>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_monthheader`}>
          <div></div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thur</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>W1</div>
          <div className="monday">
            {weekOne &&
              weekOne.map((cohort, index) => (
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
            {weekOne &&
              weekOne.map((cohort, index) =>
                cohort.period === 'weekend' ? (
                  <div key={`${cohort.name}-${index}`}>
                    <div>
                      <div className={`courseWeekend ${cohort.period}`}>
                        {cohort.schedules.map((obj) => (
                          <div key={`${cohort.name}-${index}-${obj.id}`}>{obj.course.name}</div>
                        ))}
                        {cohort.schedules[0].course.name}/ {cohort.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>W2</div>
          <div>
            {weekTwo &&
              weekTwo.map((cohort, index) => (
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
            {weekTwo &&
              weekTwo.map((cohort, index) =>
                cohort.period === 'weekend' ? (
                  <div key={`${cohort.name}-${index}`}>
                    <div>
                      <div className={`courseWeekend ${cohort.period}`}>
                        {cohort.schedules.map((obj) => (
                          <div key={`${cohort.name}-${index}-${obj.id}`}>{obj.course.name}</div>
                        ))}
                        {cohort.schedules[0].course.name}/ {cohort.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>W3</div>
          <div>
            {weekThree &&
              weekThree.map((cohort, index) => (
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
            {weekThree &&
              weekThree.map((cohort, index) =>
                cohort.period === 'weekend' ? (
                  <div key={`${cohort.name}-${index}`}>
                    <div>
                      <div className={`courseWeekend ${cohort.period}`}>
                        {cohort.schedules.map((obj) => (
                          <div key={`${cohort.name}-${index}-${obj.id}`}>{obj.course.name}</div>
                        ))}
                        {cohort.schedules[0].course.name}/ {cohort.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>W4</div>
          <div>
            {weekFour &&
              weekFour.map((cohort, index) => (
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
            {weekFour &&
              weekFour.map((cohort, index) =>
                cohort.period === 'weekend' ? (
                  <div key={`${cohort.name}-${index}`}>
                    <div>
                      <div className={`courseWeekend ${cohort.period}`}>
                        {cohort.schedules.map((obj) => (
                          <div key={`${cohort.name}-${index}-${obj.id}`}>{obj.course.name}</div>
                        ))}
                        {cohort.schedules[0].course.name}/ {cohort.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_monthcontent`}>
          <div>W5</div>
          <div>
            {weekFive &&
              weekFive.map((cohort, index) => (
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
            {weekFive &&
              weekFive.map((cohort, index) =>
                cohort.period === 'weekend' ? (
                  <div key={`${cohort.name}-${index}`}>
                    <div>
                      <div className={`courseWeekend ${cohort.period}`}>
                        {cohort.schedules.map((obj) => (
                          <div key={`${cohort.name}-${index}-${obj.id}`}>{obj.course.name}</div>
                        ))}
                        {cohort.schedules[0].course.name}/ {cohort.name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>
          <div></div>
        </div>
        {cnt_week > 5 ? (
          <>
            <div className={`${BASE_CLASS}_monthcontent`}>
              <div>W6</div>
              <div>
                {weekSix &&
                  weekSix.map((cohort, index) => (
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
                {weekFive &&
                  weekFive.map((cohort, index) =>
                    cohort.period === 'weekend' ? (
                      <div key={`${cohort.name}-${index}`}>
                        <div>
                          <div className={`courseWeekend ${cohort.period}`}>
                            {cohort.schedules.map((obj) => (
                              <div key={`${cohort.name}-${index}-${obj.id}`}>{obj.course.name}</div>
                            ))}
                            {cohort.schedules[0].course.name}/ {cohort.name}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
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
