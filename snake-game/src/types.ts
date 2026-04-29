export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type GameStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'GAME_OVER';
