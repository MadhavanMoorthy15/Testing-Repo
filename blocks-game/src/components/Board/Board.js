import React, { useMemo } from 'react';
import styles from './Board.module.css';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../constants/gameConfig';

/**
 * Merges the locked board cells with the current (active) piece and ghost piece
 * into a single flat cell array for rendering.
 */
const buildDisplayGrid = (board, currentPiece, ghostY) => {
  // Deep copy locked board
  const grid = board.map((row) => row.map((cell) => ({ ...cell, isActive: false, isGhost: false })));

  // Draw ghost piece first (underneath active piece)
  if (currentPiece && ghostY !== null) {
    currentPiece.shape.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (!cell) return;
        const r = ghostY + rIdx;
        const c = currentPiece.pos.x + cIdx;
        if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
          if (!grid[r][c].filled) {
            grid[r][c] = {
              filled: false,
              isGhost: true,
              isActive: false,
              color: currentPiece.color,
              shadowColor: currentPiece.shadowColor,
            };
          }
        }
      });
    });
  }

  // Draw active piece on top
  if (currentPiece) {
    currentPiece.shape.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (!cell) return;
        const r = currentPiece.pos.y + rIdx;
        const c = currentPiece.pos.x + cIdx;
        if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
          grid[r][c] = {
            filled: true,
            isActive: true,
            isGhost: false,
            color: currentPiece.color,
            shadowColor: currentPiece.shadowColor,
          };
        }
      });
    });
  }

  return grid;
};

const Board = ({ board, currentPiece, ghostY }) => {
  const grid = useMemo(
    () => buildDisplayGrid(board, currentPiece, ghostY),
    [board, currentPiece, ghostY]
  );

  return (
    <div className={styles.boardWrapper}>
      <div
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            let cellClass = styles.cell;
            if (cell.isGhost) cellClass += ` ${styles.ghost}`;
            else if (cell.filled) cellClass += ` ${styles.filled}${cell.isActive ? ` ${styles.active}` : ''}`;
            else cellClass += ` ${styles.empty}`;

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={cellClass}
                style={
                  cell.color
                    ? {
                        '--cell-color': cell.color,
                        '--cell-shadow': cell.shadowColor,
                      }
                    : undefined
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
