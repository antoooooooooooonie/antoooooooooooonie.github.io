import { Piece, PieceType } from "./interfaces";

export const addReverseTransformations = (
  transformations: Piece["transformations"]
): Piece["transformations"] => {
  return [
    ...transformations,
    ...transformations.map((transformation) => {
      return transformation.map(([x, y]) => [-x, -y]);
    }),
  ];
};

// Transformations could be optimized by using a function to generate the reverse transformations
export const pieces: Piece[] = [
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
    type: PieceType.O,
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
    ],
    type: PieceType.I,
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
    ],
    type: PieceType.L,
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
    ],
    type: PieceType.S,
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
    ],
    type: PieceType.Z,
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
    ],
    type: PieceType.T,
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
    ],
    type: PieceType.J,
  },
].map((piece) => {
  return {
    ...piece,
    transformations: addReverseTransformations(piece.transformations),
  };
});

// Get random piece
export const getRandomPiece = (): Piece => {
  return JSON.parse(
    JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
  );
};