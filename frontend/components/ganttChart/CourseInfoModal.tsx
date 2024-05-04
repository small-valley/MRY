import React from "react";
import {
  GetCohortsResponse,
  Schedule,
} from "../../../shared/models/responses/getCohortsResponse";

interface CourseInfoModalProps {
  cohort: GetCohortsResponse;
  schedule: Schedule;
}

const CourseInfoModal = ({ cohort, schedule }: CourseInfoModalProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: -80,
        left: 60,
        backgroundColor: "#FFF",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        zIndex: 2,
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        width: 200,
      }}
    >
      <p>
        {cohort?.program} {cohort?.name}
      </p>
      <p>{cohort?.room}</p>
      <p>From: {schedule?.startDate}</p>
      <p>To: {schedule?.endDate}</p>
    </div>
  );
};

export default CourseInfoModal;
