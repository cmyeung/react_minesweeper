import { useState, useEffect } from "react";
import "./App.css";
import { FlagBoard } from "./components/FlagBoard";
import { TimeBoard } from "./components/TimeBoard";
import { Board } from "./components/Board";

function App() {
  // const BoardSize = [24, 20, 99]; // Hard
  const GameConfig = { width: 18, height: 14, flag: 40 }; // Medium
  // const BoardSize = [10, 8, 10];  // Easy

  const [timeCount, setTimeCount] = useState(0);
  const [flagCount, setFlagCount] = useState(GameConfig.flag);
  const [board, setBoard] = useState(
    Array(GameConfig.width)
      .fill()
      .map((_) => Array(GameConfig.height))
      .fill(null)
  );

  // Timer of the Game, start count when the game has started
  useEffect(() => {
    setTimeout(() => {
      setTimeCount((timeCount) => timeCount + 1);
    }, 1000);
  });

  return (
    <div className="App">
      <FlagBoard flagCount={flagCount} />
      <TimeBoard timeCount={timeCount} />
      <Board />
    </div>
  );
}

export default App;
