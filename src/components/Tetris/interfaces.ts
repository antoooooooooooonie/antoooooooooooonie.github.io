export enum Actions {
  DROP_FULL = "DROP_FULL",
  DROP = "DROP",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  ROTATE = "ROTATE",
}

export enum PieceType {
  O = "O",
  I = "I",
  L = "L",
  S = "S",
  Z = "Z",
  T = "T",
  J = "J",
  GHOST = "GHOST",
}

export enum KeyboardEvents {
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  Space = " ",
}

export interface Piece {
  piece: number[][];
  transformations: number[][][];
  type: PieceType;
}

export type Grid = [number, Piece["type"] | "clear"][][];

export interface GameState {
  grid: Grid;
  currentPiece: Piece;
  level: number;
}

export interface GameStateAction {
  type: Actions;
}
