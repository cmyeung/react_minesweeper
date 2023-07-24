import React from "react";
import { Box } from "./Box";
import "./Board.css";

export const Board = ({ board }) => {
  return (
    <div className="board">
      {board.map((items, rowIdx) => {
        return (
          <p>
            {items.map((value, colIdx) => {
              return <Box value={value} />;
            })}
          </p>
        );
      })}
    </div>
  );
};
