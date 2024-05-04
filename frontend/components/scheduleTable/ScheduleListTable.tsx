import React, { useContext } from "react";
import { MockchangeDate } from "@/app/actions/common";
import { CohortsContext } from "@/app/contexts/CohortsContext";
import { GetCohortsResponse } from "../../../shared/models/responses/getCohortsResponse";

const BASE_CLASS = "schedule_table";

interface CohortForScheduleList {
  name: string;
  program: string;
  progress: number;
  scheduleLen: number;
  period: string;
  room: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function ScheduleListTable() {
  const { cohorts } = useContext(CohortsContext);
  /* Necessary Data from API
  program: string;
  name: string;
  room: string;
  period: string;
  course: Course[];
  */
  const Cohorts = cohorts?.map((item: GetCohortsResponse) => {
    const today = new Date();
    let startDate = new Date(item.schedules[0].startDate);
    let endDate = new Date(item.schedules[0].endDate);
    let progress = 0;
    let status = "ongoing";
    item.schedules.forEach((obj) => {
      let tmpStart = new Date(obj.startDate);
      let tmpEnd = new Date(obj.endDate);
      if (tmpStart < startDate) {
        startDate = tmpStart;
      }
      if (tmpEnd > endDate) {
        endDate = tmpEnd;
      }
      if (tmpEnd < today) {
        progress++;
      }
    });
    if (progress === item.schedules.length) {
      status = "finished";
    } else if (progress === 0) {
      status = "upcoming";
    }
    return {
      name: item.name,
      program: item.program,
      progress: progress,
      scheduleLen: item.schedules.length,
      period: item.period,
      room: item.room,
      startDate: MockchangeDate(startDate),
      endDate: MockchangeDate(endDate),
      status: status,
    };
  });

  return (
    <>
      <ul className={BASE_CLASS}>
        <li className={`${BASE_CLASS}_listheader`} key="list-header">
          <div>Start Date</div>
          <div>End Date</div>
          <div>Cohort</div>
          <div>Program</div>
          <div>Progress</div>
          <div>Period</div>
          <div>Room</div>
          <div>Days</div>
        </li>
        {Cohorts?.map((cohort: CohortForScheduleList, index: number) => (
          <li
            className={`${BASE_CLASS}_listcontent ${cohort.status}`}
            key={`${cohort.name}-${index}`}
          >
            <div>{cohort.startDate}</div>
            <div>{cohort.endDate}</div>
            <div>{cohort.name}</div>
            <div>{cohort.program}</div>
            <div>
              {cohort.progress}/{cohort.scheduleLen}
            </div>
            <div className={cohort.period}>{cohort.period}</div>
            <div>{cohort.room}</div>

            {cohort.period === "weekend" ? (
              <div>Sat - Sun</div>
            ) : (
              <div>Mon - Fri</div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
