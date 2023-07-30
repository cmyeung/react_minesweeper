import React from "react";
import "./Box.css";

export const Box = ({ state }) => {
  const ColorList = [
    "text-blue",
    "text-green",
    "text-cyan",
    "text-purple",
    "text-brown",
    "text-red",
    "text-orange",
    "text-magenta",
  ];

  let style = "box";
  let value = "";

  if (state === -1) {
    style += " close";
  } else if (state === -2) {
    style += " close flag";
  } else if (state === -3) {
    style += " open bomb";
  } else if (state === 0) {
    style += " open";
  } else if (state >= 0 && state <= 8) {
    value += state;
    style += " open " + ColorList[state - 1];
  }

  return <button className={style}>{value}</button>;
};
