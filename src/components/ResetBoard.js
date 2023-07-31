import React from "react";
import "./ResetBoard.css";

export const ResetBoard = ({ gameStatus, onClick }) => {
  let style;
  switch (gameStatus) {
    case 0:
      style = "waiting";
      break;
    case 1:
      style = "playing";
      break;
    case 2:
      style = "win";
      break;
    case 3:
      style = "lose";
      break;
    default:
      break;
  }

  return (
    <div>
      <button className={"resetButton " + style} onClick={onClick}></button>
    </div>
  );
};
