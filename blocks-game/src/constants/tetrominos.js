// All 7 Tetromino shapes with their rotation states and colors
export const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f5ff',
    shadowColor: '#00b8c0',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffd700',
    shadowColor: '#c0a000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#bf00ff',
    shadowColor: '#8a00bb',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#39ff14',
    shadowColor: '#28bb0e',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff073a',
    shadowColor: '#bb0028',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff6600',
    shadowColor: '#bb4900',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0066ff',
    shadowColor: '#0049bb',
  },
};

export const TETROMINO_KEYS = Object.keys(TETROMINOS);

export const randomTetromino = () => {
  const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  return { ...TETROMINOS[key], type: key };
};
