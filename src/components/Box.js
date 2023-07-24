import React from "react";
import "./Box.css";

export const Box = ({ value }) => {
  let style = "box";
  switch (value) {
    case 0:
      style = "box close";
      break;
    case -1:
      style = "box bomb";
      break;
    default:
      style = "box open text-red";
  }

  return <button className={style}>{5}</button>;
};
