import { useState, useEffect, useCallback, useRef } from 'react';
import { randomTetromino } from '../constants/tetrominos';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  EMPTY_CELL,
  POINTS_PER_LINE,
  LINES_PER_LEVEL,
  DROP_SPEED,
  SOFT_DROP_POINTS,
  HARD_DROP_POINTS,
} from '../constants/gameConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Board helpers
// ─────────────────────────────────────────────────────────────────────────────

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ ...EMPTY_CELL }))
  );

/** Rotate a 2-D matrix 90° clockwise */
const rotateCW = (matrix) => {
  const N = matrix.length;
  return matrix[0].map((_, colIdx) =>
    matrix.map((row) => row[colIdx]).reverse()
  );
};

/** Rotate a 2-D matrix 90° counter-clockwise */
const rotateCCW = (matrix) => {
  const N = matrix.length;
  return matrix[0].map((_, colIdx) =>
    matrix.map((row) => row[N - 1 - colIdx])
  );
};

/** Returns true if placing `piece` at `pos` is valid on `board` */
const isValidPosition = (board, shape, pos) => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const boardR = pos.y + r;
      const boardC = pos.x + c;
      if (boardC < 0 || boardC >= BOARD_WIDTH) return false;
      if (boardR >= BOARD_HEIGHT) return false;
      if (boardR >= 0 && board[boardR][boardC].filled) return false;
    }
  }
  return true;
};

/**
 * Wall-kick offsets (Super Rotation System, simplified).
 * Tries standard offsets before giving up on a rotation.
 */
const KICK_OFFSETS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];

/** Lock current piece into the board; returns the new board */
const lockPiece = (board, shape, pos, color, shadowColor) => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  shape.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (!cell) return;
      const r = pos.y + rIdx;
      const c = pos.x + cIdx;
      if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
        newBoard[r][c] = { filled: true, color, shadowColor };
      }
    });
  });
  return newBoard;
};

/** Clears completed rows; returns { newBoard, linesCleared } */
const clearLines = (board) => {
  const remaining = board.filter((row) => row.some((cell) => !cell.filled));
  const linesCleared = BOARD_HEIGHT - remaining.length;
  const newRows = Array.from({ length: linesCleared }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ ...EMPTY_CELL }))
  );
  return { newBoard: [...newRows, ...remaining], linesCleared };
};

/** Calculate the ghost Y position */
const calcGhostY = (board, shape, pos) => {
  let ghostY = pos.y;
  while (isValidPosition(board, shape, { x: pos.x, y: ghostY + 1 })) {
    ghostY++;
  }
  return ghostY;
};

/** Spawn position for a new piece */
const spawnPos = (shape) => ({
  x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
  y: 0,
});

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

const useGameLogic = () => {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [ghostY, setGhostY] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('blocksHighScore') || '0', 10)
  );
  const [gameStatus, setGameStatus] = useState('idle'); // idle | running | paused | gameOver

  // Use refs to avoid stale closures inside the interval callback
  const boardRef = useRef(board);
  const currentPieceRef = useRef(currentPiece);
  const scoreRef = useRef(score);
  const linesRef = useRef(lines);
  const levelRef = useRef(level);
  const gameStatusRef = useRef(gameStatus);
  const nextPieceRef = useRef(nextPiece);

  boardRef.current = board;
  currentPieceRef.current = currentPiece;
  scoreRef.current = score;
  linesRef.current = lines;
  levelRef.current = level;
  gameStatusRef.current = gameStatus;
  nextPieceRef.current = nextPiece;

  // ── Internal: spawn a piece ────────────────────────────────────────────────
  const spawnPiece = useCallback((piece, boardSnapshot) => {
    const pos = spawnPos(piece.shape);
    // Check game-over condition
    if (!isValidPosition(boardSnapshot, piece.shape, pos)) {
      setGameStatus('gameOver');
      setCurrentPiece(null);
      setGhostY(null);
      // Persist high score
      const hs = parseInt(localStorage.getItem('blocksHighScore') || '0', 10);
      if (scoreRef.current > hs) {
        localStorage.setItem('blocksHighScore', String(scoreRef.current));
        setHighScore(scoreRef.current);
      }
      return;
    }
    const ghost = calcGhostY(boardSnapshot, piece.shape, pos);
    setCurrentPiece({ ...piece, pos });
    setGhostY(ghost);
  }, []);

  // ── Internal: lock + clear + spawn ────────────────────────────────────────
  const lockAndAdvance = useCallback(
    (shape, pos, color, shadowColor) => {
      const locked = lockPiece(boardRef.current, shape, pos, color, shadowColor);
      const { newBoard, linesCleared } = clearLines(locked);

      // Score
      const linePoints = POINTS_PER_LINE[linesCleared] || 0;
      const newScore = scoreRef.current + linePoints * levelRef.current;
      const newLines = linesRef.current + linesCleared;
      const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;

      setBoard(newBoard);
      setScore(newScore);
      setLines(newLines);
      setLevel(newLevel);
      scoreRef.current = newScore;
      linesRef.current = newLines;
      levelRef.current = newLevel;
      boardRef.current = newBoard;

      // Generate next piece
      const upcoming = randomTetromino();
      const current = nextPieceRef.current;
      setNextPiece(upcoming);
      nextPieceRef.current = upcoming;

      spawnPiece(current, newBoard);
    },
    [spawnPiece]
  );

  // ── Gravity tick ──────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;

    const newPos = { x: piece.pos.x, y: piece.pos.y + 1 };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      setCurrentPiece((p) => ({ ...p, pos: newPos }));
    } else {
      lockAndAdvance(piece.shape, piece.pos, piece.color, piece.shadowColor);
    }
  }, [lockAndAdvance]);

  // ── Gravity interval ─────────────────────────────────────────────────────
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, DROP_SPEED(levelRef.current));
  }, [tick]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Restart interval when level changes (speed changes)
  useEffect(() => {
    if (gameStatus === 'running') {
      startInterval();
    }
    return stopInterval;
  }, [gameStatus, level, startInterval, stopInterval]);

  // ── Public: startGame ─────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    const first = randomTetromino();
    const second = randomTetromino();

    setBoard(emptyBoard);
    setScore(0);
    setLines(0);
    setLevel(1);
    setNextPiece(second);
    nextPieceRef.current = second;
    boardRef.current = emptyBoard;
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;

    setGameStatus('running');

    const pos = spawnPos(first.shape);
    const ghost = calcGhostY(emptyBoard, first.shape, pos);
    setCurrentPiece({ ...first, pos });
    setGhostY(ghost);
  }, []);

  // ── Public: resetGame → back to idle ─────────────────────────────────────
  const resetGame = useCallback(() => {
    stopInterval();
    setGameStatus('idle');
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPiece(null);
    setGhostY(null);
    setScore(0);
    setLines(0);
    setLevel(1);
  }, [stopInterval]);

  // ── Public: togglePause ───────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    setGameStatus((s) => {
      if (s === 'running') return 'paused';
      if (s === 'paused') return 'running';
      return s;
    });
  }, []);

  // ── Public: moveLeft ──────────────────────────────────────────────────────
  const moveLeft = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;
    const newPos = { x: piece.pos.x - 1, y: piece.pos.y };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      const ghost = calcGhostY(boardRef.current, piece.shape, newPos);
      setCurrentPiece((p) => ({ ...p, pos: newPos }));
      setGhostY(ghost);
    }
  }, []);

  // ── Public: moveRight ─────────────────────────────────────────────────────
  const moveRight = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;
    const newPos = { x: piece.pos.x + 1, y: piece.pos.y };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      const ghost = calcGhostY(boardRef.current, piece.shape, newPos);
      setCurrentPiece((p) => ({ ...p, pos: newPos }));
      setGhostY(ghost);
    }
  }, []);

  // ── Public: softDrop ──────────────────────────────────────────────────────
  const softDrop = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;
    const newPos = { x: piece.pos.x, y: piece.pos.y + 1 };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      setCurrentPiece((p) => ({ ...p, pos: newPos }));
      setScore((s) => s + SOFT_DROP_POINTS);
      scoreRef.current += SOFT_DROP_POINTS;
    } else {
      lockAndAdvance(piece.shape, piece.pos, piece.color, piece.shadowColor);
    }
  }, [lockAndAdvance]);

  // ── Public: hardDrop ──────────────────────────────────────────────────────
  const hardDrop = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;

    const dropY = calcGhostY(boardRef.current, piece.shape, piece.pos);
    const cells = dropY - piece.pos.y;
    setScore((s) => s + cells * HARD_DROP_POINTS);
    scoreRef.current += cells * HARD_DROP_POINTS;

    lockAndAdvance(
      piece.shape,
      { x: piece.pos.x, y: dropY },
      piece.color,
      piece.shadowColor
    );
    // Reset interval so gravity doesn't fire immediately after hard drop
    startInterval();
  }, [lockAndAdvance, startInterval]);

  // ── Public: rotatePieceCW ─────────────────────────────────────────────────
  const rotatePieceCW = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;

    const rotated = rotateCW(piece.shape);
    for (const offset of KICK_OFFSETS) {
      const newPos = { x: piece.pos.x + offset.x, y: piece.pos.y + offset.y };
      if (isValidPosition(boardRef.current, rotated, newPos)) {
        const ghost = calcGhostY(boardRef.current, rotated, newPos);
        setCurrentPiece((p) => ({ ...p, shape: rotated, pos: newPos }));
        setGhostY(ghost);
        return;
      }
    }
  }, []);

  // ── Public: rotatePieceCCW ────────────────────────────────────────────────
  const rotatePieceCCW = useCallback(() => {
    if (gameStatusRef.current !== 'running') return;
    const piece = currentPieceRef.current;
    if (!piece) return;

    const rotated = rotateCCW(piece.shape);
    for (const offset of KICK_OFFSETS) {
      const newPos = { x: piece.pos.x + offset.x, y: piece.pos.y + offset.y };
      if (isValidPosition(boardRef.current, rotated, newPos)) {
        const ghost = calcGhostY(boardRef.current, rotated, newPos);
        setCurrentPiece((p) => ({ ...p, shape: rotated, pos: newPos }));
        setGhostY(ghost);
        return;
      }
    }
  }, []);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      // Block browser scroll on arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':  moveLeft();      break;
        case 'ArrowRight': moveRight();     break;
        case 'ArrowDown':  softDrop();      break;
        case 'ArrowUp':
        case 'x':
        case 'X':          rotatePieceCW(); break;
        case 'z':
        case 'Z':          rotatePieceCCW(); break;
        case ' ':          hardDrop();      break;
        case 'p':
        case 'P':
        case 'Escape':     togglePause();   break;
        default: break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [moveLeft, moveRight, softDrop, hardDrop, rotatePieceCW, rotatePieceCCW, togglePause]);

  return {
    board,
    currentPiece,
    nextPiece,
    ghostY,
    score,
    lines,
    level,
    highScore,
    gameStatus,
    startGame,
    resetGame,
    togglePause,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    rotatePieceCW,
    rotatePieceCCW,
  };
};

export default useGameLogic;
