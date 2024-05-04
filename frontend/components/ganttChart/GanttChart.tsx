import React from "react";
import Grid from "./Grid";
import Cohorts from "./Cohorts";
import TimeTable from "./TimeTable";
import "./GanttChart.scss";

const GanttChart = () => {
  return (
    <div id="gantt-container">
      <Grid>
        <Cohorts />
        <TimeTable />
      </Grid>
    </div>
  );
};

export default GanttChart;
