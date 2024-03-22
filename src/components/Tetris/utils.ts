import { getRandomPiece } from "./block-data";
import { COLUMNS, ROWS } from "./game-data";
import { Piece, Grid, Actions, PieceType, GameState } from "./interfaces";
import { getMovedPiece } from "./movements";

// Add the piece on the grid
export const addPieceOnGrid = (currentPiece: Piece, grid: Grid): Grid => {
  const newGrid = JSON.parse(JSON.stringify(grid));

  currentPiece.piece.forEach(([x, y]) => {
    if (y < 0 || x < 0 || y >= newGrid.length || x >= newGrid[0].length) {
      return;
    }
    newGrid[y][x] = [1, currentPiece.type];
  });

  return newGrid;
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

// Reducer for the game
export function processGame(
  {
    grid,
    currentPiece,
    level,
  }: {
    grid: Grid;
    currentPiece: Piece;
    level: number;
  },
  { type }: { type: Actions }
) {
  const { piece: movedPiece, isColliding } = getMovedPiece(
    type,
    currentPiece,
    grid
  );

  const getNewState = () => {
    if (isColliding) {
      // Move the piece to the grid when it collides during a drop
      if (type === Actions.DROP) {
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

export const getColorByType = (type: Piece["type"]) => {
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

export const drawTetris = (gameState: GameState) => {
  // Get the ghost piece position
  const { piece: ghostPiece } = getMovedPiece(
    Actions.DROP_FULL,
    { ...gameState.currentPiece, type: PieceType.GHOST },
    gameState.grid
  );

  // Add the ghost piece on the grid
  const gridWithGhostPiece = addPieceOnGrid(ghostPiece, gameState.grid);

  // Place the actual current piece last so it's drawn on top of the ghost piece
  return addPieceOnGrid(gameState.currentPiece, gridWithGhostPiece);
};

export const initializeState = (): GameState => ({
  grid: Array.from(Array(ROWS), () => new Array(COLUMNS).fill([0, "clear"])),
  currentPiece: getRandomPiece(),
  level: 1,
});
