import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GRID_SIZE,
  INITIAL_SPEED,
  MIN_SPEED,
  POINTS_PER_FOOD,
  SPEED_INCREMENT,
} from './constants';
import { Direction, GameStatus, Point } from './types';

const randomPoint = (exclude: Point[]): Point => {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some((p) => p.x === point.x && p.y === point.y));
  return point;
};

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export interface SnakeGameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  speed: number;
}

export interface SnakeGameActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  changeDirection: (dir: Direction) => void;
}

export function useSnakeGame(): SnakeGameState & SnakeGameActions {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(() => randomPoint(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('snakeHighScore');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Refs to avoid stale closures inside the interval
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const directionRef = useRef(direction);
  const pendingDirRef = useRef<Direction | null>(null);
  const statusRef = useRef(status);
  const scoreRef = useRef(score);

  snakeRef.current = snake;
  foodRef.current = food;
  directionRef.current = direction;
  statusRef.current = status;
  scoreRef.current = score;

  const tick = useCallback(() => {
    if (statusRef.current !== 'RUNNING') return;

    // Apply pending direction change
    if (pendingDirRef.current) {
      directionRef.current = pendingDirRef.current;
      setDirection(pendingDirRef.current);
      pendingDirRef.current = null;
    }

    const currentSnake = snakeRef.current;
    const head = currentSnake[0];
    const dir = directionRef.current;

    const newHead: Point = {
      x:
        dir === 'LEFT'
          ? head.x - 1
          : dir === 'RIGHT'
          ? head.x + 1
          : head.x,
      y:
        dir === 'UP'
          ? head.y - 1
          : dir === 'DOWN'
          ? head.y + 1
          : head.y,
    };

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      gameOver();
      return;
    }

    // Self collision (skip last tail segment because it will move)
    const body = currentSnake.slice(0, -1);
    if (body.some((p) => p.x === newHead.x && p.y === newHead.y)) {
      gameOver();
      return;
    }

    const ateFood =
      newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;

    const newSnake = ateFood
      ? [newHead, ...currentSnake]          // grow
      : [newHead, ...currentSnake.slice(0, -1)]; // move

    setSnake(newSnake);
    snakeRef.current = newSnake;

    if (ateFood) {
      const newScore = scoreRef.current + POINTS_PER_FOOD;
      setScore(newScore);
      scoreRef.current = newScore;

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('snakeHighScore', String(newScore));
      }

      // Speed up every 5 foods
      const foodsEaten = newScore / POINTS_PER_FOOD;
      if (foodsEaten % 5 === 0) {
        setSpeed((s) => Math.max(s - SPEED_INCREMENT * 5, MIN_SPEED));
      }

      setFood(randomPoint(newSnake));
    }
  }, [highScore]);

  const gameOver = useCallback(() => {
    setStatus('GAME_OVER');
    statusRef.current = 'GAME_OVER';
  }, []);

  // Game loop
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'RUNNING') {
      intervalRef.current = setInterval(tick, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, speed, tick]);

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT',
      };

      const newDir = keyMap[e.key];
      if (newDir) {
        e.preventDefault();
        changeDirection(newDir);
      }

      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (statusRef.current === 'RUNNING') pause();
        else if (statusRef.current === 'PAUSED') start();
        else if (statusRef.current === 'IDLE') start();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const start = useCallback(() => {
    setStatus('RUNNING');
  }, []);

  const pause = useCallback(() => {
    setStatus('PAUSED');
  }, []);

  const reset = useCallback(() => {
    const initSnake = [...INITIAL_SNAKE];
    setSnake(initSnake);
    snakeRef.current = initSnake;
    setFood(randomPoint(initSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    pendingDirRef.current = null;
    setScore(0);
    scoreRef.current = 0;
    setSpeed(INITIAL_SPEED);
    setStatus('IDLE');
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    const current = pendingDirRef.current ?? directionRef.current;
    if (newDir !== opposites[current]) {
      pendingDirRef.current = newDir;
    }
  }, []);

  return {
    snake,
    food,
    direction,
    status,
    score,
    highScore,
    speed,
    start,
    pause,
    reset,
    changeDirection,
  };
}
