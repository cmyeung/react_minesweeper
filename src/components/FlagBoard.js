import React from "react";
import "./FlagBoard.css";

export const FlagBoard = ({ flagCount }) => {
  return (
    <div className="flagBoard">
      Flag Left <p>{flagCount}</p>
    </div>
  );
};
