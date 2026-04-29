// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Cell size in pixels
export const CELL_SIZE = 32;

// Scoring system
export const POINTS_PER_LINE = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

// Lines needed to level up
export const LINES_PER_LEVEL = 10;

// Drop speed (ms) per level — gets faster as level increases
export const DROP_SPEED = (level) => Math.max(100, 800 - (level - 1) * 70);

// Soft drop multiplier
export const SOFT_DROP_POINTS = 1;

// Hard drop points per cell
export const HARD_DROP_POINTS = 2;

// Empty cell
export const EMPTY_CELL = { filled: false, color: null, shadowColor: null };
