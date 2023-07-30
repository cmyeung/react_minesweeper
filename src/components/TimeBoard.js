import React from "react";
import "./TimeBoard.css";

export const TimeBoard = ({ timeCount }) => {
  return (
    <div className="timeBoard">
      Seconds <p>{timeCount}</p>
    </div>
  );
};
