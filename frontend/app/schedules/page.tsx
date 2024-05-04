"use client";
import React, { useState } from "react";
import GanttChart from "../../components/ganttChart/GanttChart";
import "./schedules.scss";
import ScheduleListTable from "@/components/scheduleTable/ScheduleListTable";
import ScheduleMonthTable from "@/components/scheduleTable/ScheduleMonthTable";
import ScheduleWeekTable from "@/components/scheduleTable/ScheduleWeekTable";
import { CohortsProvider } from "@/app/contexts/CohortsContext";

const BASE_CLASS = 'schedule';

export default function Schedules() {
  const [isList, setList] = useState(false);
  const [isMonth, setMonth] = useState(false);
  const [isWeek, setWeek] = useState(false);
  const [isGantt, setGantt] = useState(true);

  const toggleList = () => {
    setList(true);
    setMonth(false);
    setWeek(false);
    setGantt(false);
  };
  const toggleMonth = () => {
    setList(false);
    setMonth(true);
    setWeek(false);
    setGantt(false);
  };
  const toggleWeek = () => {
    setList(false);
    setMonth(false);
    setWeek(true);
    setGantt(false);
  };
  const toggleGantt = () => {
    setList(false);
    setMonth(false);
    setWeek(false);
    setGantt(true);
  };

  return (
    <CohortsProvider>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_header`}>
          <div className={`${BASE_CLASS}_header_filter_btn`}>
            <button onClick={toggleGantt}>Gantt</button>
            <button onClick={toggleList}>List</button>
            <button onClick={toggleMonth}>Month</button>
            <button onClick={toggleWeek}>Week</button>
          </div>
        </div>
        {isList ? (
          <>
            <div className={`${BASE_CLASS}_title`}>
              <h2> All Schedule List </h2>
            </div>
            <ScheduleListTable />
          </>
        ) : (
          <></>
        )}
        {isMonth ? (
          <>
            <div className={`${BASE_CLASS}_title`}>
              <h2> 2023-Nov </h2>
            </div>
            <ScheduleMonthTable />
          </>
        ) : (
          <></>
        )}
        {isWeek ? (
          <>
            <div className={`${BASE_CLASS}_title`}>
              <h2> 2023-Nov-1W </h2>
            </div>
            <ScheduleWeekTable />
          </>
        ) : (
          <></>
        )}
        {isGantt ? (
          <>
            <div className={`${BASE_CLASS}_title`}>
              <h2> Gantt Chart </h2>
            </div>
            <GanttChart />
          </>
        ) : (
          <></>
        )}
      </div>
    </CohortsProvider>
  );
}
