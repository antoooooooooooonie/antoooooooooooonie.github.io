import { useEffect, useReducer, useRef, useState } from "react";

// Movement using direction and current piece
const move = (
  direction: number[],
  currentPiece: Piece["piece"]
): Piece["piece"] => {
  return currentPiece.map((row) => {
    const [x, y] = row;
    return [x + direction[0], y + direction[1]];
  });
};

const drop = (currentPiece: Piece["piece"]) => move([0, 1], currentPiece);
const moveLeft = (currentPiece: Piece["piece"]) => move([-1, 0], currentPiece);
const moveRight = (currentPiece: Piece["piece"]) => move([1, 0], currentPiece);

// Add the piece on the grid
const addPieceOnGrid = (currentPiece: Piece, grid: Grid): Grid => {
  const newGrid = JSON.parse(JSON.stringify(grid));

  currentPiece.piece.forEach(([x, y]) => {
    if (y < 0 || x < 0 || y >= newGrid.length || x >= newGrid[0].length) {
      return;
    }
    newGrid[y][x] = [1, currentPiece.type];
  });

  return newGrid;
};

// Check if the piece is colliding with the walls or other blocks
const isColliding = (currentPiece: Piece["piece"], grid: Grid): boolean => {
  return currentPiece.some(([x, y]) => {
    if (y < 0) {
      return false;
    }
    const colliding =
      y > grid.length - 1 ||
      x > grid[0].length - 1 ||
      x < 0 ||
      grid[y][x][1] !== "clear";

    return colliding;
  });
};

interface Piece {
  piece: number[][];
  transformations: number[][][];
  type: "O" | "I" | "L" | "S" | "Z" | "T" | "J" | "GHOST";
}

type Grid = [number, Piece["type"] | "clear"][][];

const rotate = ({ piece, transformations, type }: Piece): Piece => {
  const [transformation, ...rest] = transformations;
  return {
    piece: piece.map((row, i) => {
      return [row[0] + transformation[i][0], row[1] + transformation[i][1]];
    }),
    type,
    transformations: [...rest, transformation],
  };
};

// Transformations could be optimized by using a function to generate the reverse transformations
// But it doesn't matter for this small game
const pieces: Piece[] = [
  // O-Block
  {
    piece: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    // No transformations needed
    transformations: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    type: "O",
  },
  // // I-Block
  {
    piece: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    transformations: [
      [
        [2, -2],
        [1, -1],
        [0, 0],
        [-1, 1],
      ],
      [
        [-2, 2],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
    ],
    type: "I",
  },
  // L-Block
  {
    piece: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    transformations: [
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [0, -2],
      ],
      [
        [1, 1],
        [0, 0],
        [-1, -1],
        [-2, 0],
      ],
      [
        [1, -1],
        [0, 0],
        [-1, 1],
        [0, 2],
      ],
      [
        [-1, -1],
        [0, 0],
        [1, 1],
        [2, 0],
      ],
    ],
    type: "L",
  },
  // S-Block
  {
    piece: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    transformations: [
      [
        [0, 0],
        [-2, 0],
        [0, -2],
        [0, 0],
      ],
      [
        [0, 0],
        [2, 0],
        [0, 2],
        [0, 0],
      ],
    ],
    type: "S",
  },
  // Z-Block
  {
    piece: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    transformations: [
      [
        [0, 0],
        [0, 0],
        [-1, 0],
        [-1, -2],
      ],
      [
        [0, 0],
        [0, 0],
        [1, 0],
        [1, 2],
      ],
    ],
    type: "Z",
  },
  // T-Block
  {
    piece: [
      [1, 0],
      [0, 0],
      [2, 0],
      [1, 1],
    ],
    transformations: [
      [
        [0, 0],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ],
      [
        [0, 0],
        [1, 1],
        [-1, -1],
        [1, -1],
      ],
      [
        [0, 0],
        [-1, 1],
        [1, -1],
        [1, 1],
      ],
      [
        [0, 0],
        [-1, -1],
        [1, 1],
        [-1, 1],
      ],
    ],
    type: "T",
  },
  // J-Block
  {
    piece: [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    transformations: [
      [
        [1, 1],
        [0, 0],
        [-1, -1],
        [0, -2],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [2, 0],
      ],
      [
        [-1, -1],
        [0, 0],
        [1, 1],
        [0, 2],
      ],
      [
        [1, -1],
        [0, 0],
        [-1, 1],
        [-2, 0],
      ],
    ],
    type: "J",
  },
];

// Get random piece
const getRandomPiece = (): Piece => {
  return JSON.parse(
    JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
  );
};

// Get full rows
const getFullRows = (grid: [number, string][][]): number[] => {
  return grid
    .map((row, i) => {
      if (row.every((cell) => cell[1] !== "clear")) {
        return i;
      }
      return null;
    })
    .filter((row) => row !== null) as number[];
};

type KeyboardActions =
  | "DROP_FULL"
  | "DROP"
  | "MOVE_LEFT"
  | "MOVE_RIGHT"
  | "ROTATE";

// Movement
const movement = (type: KeyboardActions, currentPiece: Piece): Piece => {
  if (type === "ROTATE") {
    return rotate(currentPiece);
  }

  if (type === "MOVE_LEFT") {
    return {
      piece: moveLeft(currentPiece.piece),
      transformations: currentPiece.transformations,
      type: currentPiece.type,
    };
  }

  if (type === "MOVE_RIGHT") {
    return {
      piece: moveRight(currentPiece.piece),
      transformations: currentPiece.transformations,
      type: currentPiece.type,
    };
  }

  if (type === "DROP") {
    return {
      piece: drop(currentPiece.piece),
      transformations: currentPiece.transformations,
      type: currentPiece.type,
    };
  }

  return currentPiece;
};

// Get the new position of the piece
const getMovedPiece = (
  type: KeyboardActions,
  currentPiece: Piece,
  grid: Grid
): Piece => {
  if (type === "DROP_FULL") {
    const newPiece = movement("DROP", currentPiece);
    if (!isColliding(newPiece.piece, grid)) {
      return getMovedPiece(type, newPiece, grid);
    }
    return currentPiece;
  }

  return movement(type, currentPiece);
};

// Reducer for the game
function reducer(
  {
    grid,
    currentPiece,
    level,
  }: {
    grid: Grid;
    currentPiece: Piece;
    level: number;
  },
  { type }: { type: KeyboardActions }
) {
  const movedPiece = getMovedPiece(type, currentPiece, grid);

  const getNewState = () => {
    const colliding = isColliding(movedPiece.piece, grid);

    if (colliding) {
      // Move the piece to the grid when it collides during a drop
      if (type === "DROP") {
        return {
          grid: addPieceOnGrid(currentPiece, grid),
          currentPiece: getRandomPiece(),
          level: level,
        };
      } else {
        // Do nothing when the piece collides during a move other than drop
        return {
          grid,
          currentPiece,
          level: level,
        };
      }
    } else {
      // Move the piece when it doesn't collide
      return {
        grid,
        currentPiece: movedPiece,
        level: level,
      };
    }
  };

  const updatedState = getNewState();

  const fullRows = getFullRows(updatedState.grid);
  updatedState.level += fullRows.length;
  fullRows.forEach((row) => {
    updatedState.grid.splice(row, 1);
    updatedState.grid.unshift(new Array(COLUMNS).fill([0, "clear"]));
  });

  return updatedState;
}

const ROWS = 20;
const COLUMNS = 12;

export const Tetris = () => {
  const [gameState, dispatch] = useReducer(reducer, {
    grid: Array.from(Array(ROWS), () => new Array(COLUMNS).fill([0, "clear"])),
    currentPiece: getRandomPiece(),
    level: 1,
  });

  console.debug(gameState);

  const intervalId = useRef<number | null>(0);
  const [tick, setTick] = useState(0);
  const [timeInterval, setTimeInterval] = useState(3000);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        dispatch({ type: "DROP" });
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        dispatch({ type: "MOVE_LEFT" });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        dispatch({ type: "MOVE_RIGHT" });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        dispatch({ type: "ROTATE" });
      } else if (event.key === " ") {
        event.preventDefault();
        dispatch({ type: "DROP_FULL" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Increase speed
  useEffect(() => {
    setTimeInterval((interval) => {
      return interval - 100;
    });
  }, [gameState.level]);

  // Game loop
  useEffect(() => {
    if (!intervalId.current) {
      intervalId.current = setInterval(() => {
        setTick((prevTick) => prevTick + 1);
      }, timeInterval);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [timeInterval]);

  // Drop piece
  useEffect(() => {
    if (tick !== 0) {
      dispatch({ type: "DROP" });
    }
  }, [tick]);

  // Draw
  return (
    <div>
      {(() => {
        // Get the ghost piece position
        const ghostPiece = getMovedPiece(
          "DROP_FULL",
          { ...gameState.currentPiece, type: "GHOST" },
          gameState.grid
        );

        // Add the ghost piece on the grid
        const gridWithGhostPiece = addPieceOnGrid(ghostPiece, gameState.grid);

        // Place the actual current piece last so it's drawn on top of the ghost piece
        return addPieceOnGrid(gameState.currentPiece, gridWithGhostPiece);
      })().map((rows) => {
        const gridRow = rows.map((cell) => {
          if (cell[1] === "clear") {
            // Draw an empty square using svg
            return (
              <svg width="20" height="20">
                <rect
                  width="20"
                  height="20"
                  fill="white"
                  stroke="black"
                  strokeWidth="1"
                />
              </svg>
            );
          }

          // Draw a filled svg cell
          return (
            <svg width="20" height="20">
              <rect
                width="20"
                height="20"
                fill={getColorByType(cell[1])}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          );
        });

        return [...gridRow, <br />];
      })}
    </div>
  );
};

const getColorByType = (type: Piece["type"]) => {
  switch (type) {
    case "O":
      return "yellow";
    case "I":
      return "cyan";
    case "L":
      return "orange";
    case "S":
      return "green";
    case "Z":
      return "red";
    case "T":
      return "purple";
    case "J":
      return "blue";
    default:
      return "black";
  }
};
