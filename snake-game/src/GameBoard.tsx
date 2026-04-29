import React from 'react';
import { CELL_SIZE, GRID_SIZE } from './constants';
import { Point } from './types';

interface Props {
  snake: Point[];
  food: Point;
}

const boardPx = GRID_SIZE * CELL_SIZE;

const GameBoard: React.FC<Props> = ({ snake, food }) => {

  return (
    <div
      className="game-board"
      style={{ width: boardPx, height: boardPx }}
      role="img"
      aria-label="Snake game board"
    >
      {/* Grid lines rendered via CSS background, cells only for snake & food */}

      {/* Food */}
      <div
        className="cell food"
        style={{
          left: food.x * CELL_SIZE,
          top: food.y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
        }}
      />

      {/* Snake segments */}
      {snake.map((p, i) => {
        const key = `${p.x},${p.y}-${i}`;
        const isHead = i === 0;
        const isTail = i === snake.length - 1;
        return (
          <div
            key={key}
            className={`cell snake-segment ${isHead ? 'snake-head' : ''} ${isTail ? 'snake-tail' : ''}`}
            style={{
              left: p.x * CELL_SIZE,
              top: p.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
