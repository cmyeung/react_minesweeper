import { useState, useEffect } from "react";
import "./App.css";
import { FlagBoard } from "./components/FlagBoard";
import { ResetBoard } from "./components/ResetBoard";
import { TimeBoard } from "./components/TimeBoard";
import { Board } from "./components/Board";

function App() {
  const GameConst = {
    offsetX: 25,
    offsetY: 75,
    btnSize: 25,
    mouseLeft: 0,
    mouseRight: 2,
  };

  const GameStatus = {
    wait: 0,
    playing: 1,
    win: 2,
    lose: 3,
  };

  // const BoardSize = [24, 20, 99]; // Hard
  const GameConfig = {
    width: 18,
    height: 14,
    flag: 40,
  }; // Medium
  // const BoardSize = [10, 8, 10];  // Easy

  const [gameStatus, setGameStatus] = useState(0);
  const [timeCount, setTimeCount] = useState(0);
  const [flagCount, setFlagCount] = useState(GameConfig.flag);
  const [board, setBoard] = useState(
    Array(GameConfig.height)
      .fill()
      .map((_) => Array(GameConfig.width).fill(-1))
  );
  const [bombs, setBombs] = useState(
    Array(GameConfig.height)
      .fill()
      .map((_) => Array(GameConfig.width).fill(0))
  );

  const createBoard = () => {
    setBoard(
      Array(GameConfig.height)
        .fill()
        .map((_) => Array(GameConfig.width).fill(-1))
    );
  };

  const assignBombs = (rowIdx, colIdx) => {
    const randomNumbers = [];
    const noBombNumbers = [];

    const updateBombs = Array(GameConfig.height)
      .fill()
      .map((_) => Array(GameConfig.width).fill(0));

    // Numbers shall not have bombs
    for (let i = rowIdx - 1; i <= rowIdx + 1; ++i) {
      for (let j = colIdx - 1; j <= colIdx + 1; ++j) {
        if (0 <= i && i < GameConfig.width && 0 <= j && j < GameConfig.height) {
          noBombNumbers.push(i * GameConfig.height + j);
        }
      }
    }

    // Generate random bombs
    while (randomNumbers.length < GameConfig.flag) {
      // Generates a random number between 0 and product of board dimensions
      const randomNumber = Math.floor(
        Math.random() * GameConfig.width * GameConfig.height
      );

      // Skip numbers shall not have bomb
      if (noBombNumbers.includes(randomNumber)) {
        continue;
      }

      // Append the random bombs
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber);
      }
    }

    // Assign bombs to the board
    randomNumbers.map((value) => {
      const assignY = value % GameConfig.height;
      const assignX = Math.floor(value / GameConfig.height);
      updateBombs[assignY][assignX] = 1;
    });

    setBombs(updateBombs);
  };

  const checkWining = () => {
    let cnt = 0;
    // When all matched flag + close box equal number of bomb, its win
    for (let i = 0; i < GameConfig.height; ++i) {
      for (let j = 0; j < GameConfig.width; ++j) {
        if (board[i][j] === -1 || (board[i][j] === -2 && bombs[i][j] === 1)) {
          cnt += 1;
        }
      }
    }
    if (cnt === GameConfig.flag) {
      setGameStatus(GameStatus.win);
    }
  };

  const showAllBombs = () => {
    for (let i = 0; i < GameConfig.height; ++i) {
      for (let j = 0; j < GameConfig.width; ++j) {
        if (bombs[i][j] === 1) {
          updateBoard(j, i, -3);
        }
      }
    }
  };

  const updateBoard = (rowIdx, colIdx, value) => {
    setBoard((board) =>
      board.map((row, i) =>
        i === colIdx ? row.map((el, j) => (j === rowIdx ? value : el)) : row
      )
    );
  };

  const openGameBox = (rowIdx, colIdx) => {
    let cnt = 0;
    for (let i = rowIdx - 1; i <= rowIdx + 1; ++i) {
      for (let j = colIdx - 1; j <= colIdx + 1; ++j) {
        if (0 <= i && i < GameConfig.width && 0 <= j && j < GameConfig.height) {
          if (bombs[j][i] === 1) {
            cnt++;
          }
        }
      }
    }

    console.log("cnt = ", cnt);
    updateBoard(rowIdx, colIdx, cnt);

    // Open adjacent boxes
    // if (cnt === 0) {
    //   for (let i = rowIdx - 1; i <= rowIdx + 1; ++i) {
    //     for (let j = colIdx - 1; j <= colIdx + 1; ++j) {
    //       if (
    //         0 <= i &&
    //         i < GameConfig.width &&
    //         0 <= j &&
    //         j < GameConfig.height
    //       ) {
    //         if (board[j][i] === -1) {
    //           openGameBox(i, j);
    //         }
    //       }
    //     }
    //   }
    // }
  };

  const handleBoardClickLeft = (rowIdx, colIdx) => {
    // if the game has not started, generate the bombs to the board
    if (gameStatus === GameStatus.wait) {
      assignBombs(rowIdx, colIdx);
      setGameStatus(GameStatus.playing);
    }
    // if the box is a bomb, lose the game
    if (bombs[colIdx][rowIdx] === 1) {
      setGameStatus(GameStatus.lose);
      showAllBombs();
    } else {
      openGameBox(rowIdx, colIdx);
    }
  };

  const handleBoardClickRight = (rowIdx, colIdx) => {
    // If the box not open, set or unset flag
    if (flagCount > 0 && board[colIdx][rowIdx] === -1) {
      updateBoard(rowIdx, colIdx, -2);
      setFlagCount(flagCount - 1);
    } else if (board[colIdx][rowIdx] === -2) {
      updateBoard(rowIdx, colIdx, -1);
      setFlagCount(flagCount + 1);
    }
  };

  const handleBoardClick = (e) => {
    const xPos = e.clientX;
    const yPos = e.clientY;

    // The click is out of range of the board component
    if (
      xPos < GameConst.offsetX ||
      yPos < GameConst.offsetY ||
      xPos >= GameConst.btnSize * GameConfig.width + GameConst.offsetX ||
      yPos >= GameConst.btnSize * GameConfig.height + GameConst.offsetY
    ) {
      return;
    }

    // Evaulate the button index (rowIdx and colIdx)
    const rowIdx = Math.floor((xPos - GameConst.offsetX) / GameConst.btnSize);
    const colIdx = Math.floor((yPos - GameConst.offsetY) / GameConst.btnSize);

    let action = "";
    switch (e.button) {
      case GameConst.mouseLeft:
        action = "Left click";
        if (
          gameStatus === GameStatus.wait ||
          gameStatus === GameStatus.playing
        ) {
          handleBoardClickLeft(rowIdx, colIdx);
        }
        break;
      case GameConst.mouseRight:
        action = "Right click";
        if (gameStatus === GameStatus.playing) {
          handleBoardClickRight(rowIdx, colIdx);
        }
        break;
    }

    checkWining();

    console.log(
      "Event: ",
      action,
      " Row Index: ",
      rowIdx,
      ", Col Index: ",
      colIdx
    );
  };

  const handleResetClick = () => {
    console.log("Click Reset Button");
    if (gameStatus === GameStatus.win || gameStatus === GameStatus.lose) {
      setGameStatus(GameStatus.wait);
      createBoard();
    }
  };

  // Timer of the Game, start count when the game has started
  useEffect(() => {
    setTimeout(() => {
      setTimeCount((timeCount) => timeCount + 1);
    }, 1000);
  });

  return (
    <div
      className="App"
      onMouseDown={handleBoardClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="AppStatus">
        <FlagBoard flagCount={flagCount} />
        <ResetBoard gameStatus={gameStatus} onClick={handleResetClick} />
        <TimeBoard timeCount={timeCount} />
      </div>
      <Board board={board} bombs={bombs} />
    </div>
  );
}

export default App;
