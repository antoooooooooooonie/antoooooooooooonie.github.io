import { Piece, Grid, Actions } from "./interfaces";

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

// Check if the piece is colliding with the walls or other blocks
const isColliding = (
  currentPiece: Piece["piece"],
  grid: Grid
): boolean => {
  return currentPiece.some(([x, y]) => {
    // Allow a block to be rotated beyond the ceiling
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

// Apply a rotation to the piece, return the rotated piece and set the next transformation to be applied to the front of the transformations array
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

// Movement
const movement = (
  type: Omit<Actions, Actions.DROP_FULL>,
  currentPiece: Piece
): Piece => {
  if (type === Actions.ROTATE) {
    return rotate(currentPiece);
  }

  if (type === Actions.MOVE_LEFT) {
    return {
      piece: moveLeft(currentPiece.piece),
      transformations: currentPiece.transformations,
      type: currentPiece.type,
    };
  }

  if (type === Actions.MOVE_RIGHT) {
    return {
      piece: moveRight(currentPiece.piece),
      transformations: currentPiece.transformations,
      type: currentPiece.type,
    };
  }

  if (type === Actions.DROP) {
    return {
      piece: drop(currentPiece.piece),
      transformations: currentPiece.transformations,
      type: currentPiece.type,
    };
  }

  return currentPiece;
};

// Get the new position of the piece
export const getMovedPiece = (
  type: Actions,
  currentPiece: Piece,
  grid: Grid
): { piece: Piece; isColliding: boolean } => {
  if (type === Actions.DROP_FULL) {
    const newPiece = movement(Actions.DROP, currentPiece);
    if (!isColliding(newPiece.piece, grid)) {
      return getMovedPiece(type, newPiece, grid);
    }
    return { piece: currentPiece, isColliding: false };
  }

  const movedPiece = movement(type, currentPiece);

  return {
    piece: movedPiece,
    isColliding: isColliding(movedPiece.piece, grid),
  };
};
