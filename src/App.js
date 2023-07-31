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

  const GameConfig = {
    width: 18,
    height: 14,
    flag: 40,
  }; // Medium
  // const BoardSize = [24, 20, 99]; // Hard
  // const BoardSize = [10, 8, 10];  // Easy

  // States in the Games
  const [gameStatus, setGameStatus] = useState(GameStatus.wait);
  const [timeCount, setTimeCount] = useState(0);
  const [flagCount, setFlagCount] = useState(GameConfig.flag);
  const [openLocation, setOpenLocation] = useState({ rowIdx: -1, colIdx: -1 });
  const [cntCheckWinning, setCntCheckWinning] = useState(0);
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
    setBombs(
      Array(GameConfig.height)
        .fill()
        .map((_) => Array(GameConfig.width).fill(0))
    );
    setOpenLocation({ rowIdx: -1, colIdx: -1 });
    setCntCheckWinning(0);
    setTimeCount(0);
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

  // Call openGameBox in the next render cycle
  useEffect(() => {
    checkWining();
  }, [cntCheckWinning]);

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

  const openGameBox = (gameBoard, rowIdx, colIdx) => {
    // Skip to process
    if (rowIdx < 0 || rowIdx >= GameConfig.width) {
      return;
    }
    if (colIdx < 0 || colIdx >= GameConfig.height) {
      return;
    }
    if (gameBoard[colIdx][rowIdx] !== -1) {
      return;
    }

    // Count number of Bombs
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

    gameBoard[colIdx][rowIdx] = cnt;

    // Open adjacent boxes
    if (cnt === 0) {
      for (let i = rowIdx - 1; i <= rowIdx + 1; ++i) {
        for (let j = colIdx - 1; j <= colIdx + 1; ++j) {
          openGameBox(gameBoard, i, j);
        }
      }
    }
  };

  // Call openGameBox in the next render cycle
  useEffect(() => {
    const updBoard = board.map((row) => [...row]);
    openGameBox(updBoard, openLocation.rowIdx, openLocation.colIdx);
    setBoard(updBoard);
    setCntCheckWinning(cntCheckWinning + 1);
  }, [openLocation]);

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
      setOpenLocation({ rowIdx: rowIdx, colIdx: colIdx });
    }
  };

  const handleBoardClickRight = (rowIdx, colIdx) => {
    // If the box not open, set or unset flag
    if (flagCount > 0 && board[colIdx][rowIdx] === -1) {
      updateBoard(rowIdx, colIdx, -2);
      setFlagCount(flagCount - 1);
      setCntCheckWinning(cntCheckWinning + 1);
    } else if (board[colIdx][rowIdx] === -2) {
      updateBoard(rowIdx, colIdx, -1);
      setFlagCount(flagCount + 1);
    }
  };

  const handleBoardClick = (e) => {
    const xPos = e.pageX;
    const yPos = e.pageY;

    console.log(
      "ClientX = ",
      e.clientX,
      ", PageX = ",
      e.pageX,
      ", ScrollX = ",
      window.scrollX
    );

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

    // Logging of mouse actions
    const logstr =
      action + " - Row Index: " + rowIdx + ", Col Index: " + colIdx;
    console.log(logstr);
  };

  const handleResetClick = () => {
    console.log("Click Reset Button");
    if (gameStatus === GameStatus.win || gameStatus === GameStatus.lose) {
      setGameStatus(GameStatus.wait);
      createBoard();
      setFlagCount(GameConfig.flag);
    }
  };

  // Timer of the Game, start count when the game has started
  useEffect(() => {
    let timerId;
    if (gameStatus === GameStatus.playing) {
      timerId = setInterval(() => {
        setTimeCount((timeCount) => timeCount + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [gameStatus]);

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
