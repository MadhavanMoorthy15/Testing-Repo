import React from 'react';
import styles from './NextPiece.module.css';

const PREVIEW_SIZE = 4; // preview grid is 4×4

const NextPiece = ({ piece }) => {
  // Center the piece inside the 4×4 preview grid
  const grid = Array.from({ length: PREVIEW_SIZE }, () =>
    Array(PREVIEW_SIZE).fill(null)
  );

  if (piece) {
    const rowOffset = Math.floor((PREVIEW_SIZE - piece.shape.length) / 2);
    const colOffset = Math.floor((PREVIEW_SIZE - piece.shape[0].length) / 2);
    piece.shape.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell) {
          grid[rowOffset + rIdx][colOffset + cIdx] = piece;
        }
      });
    });
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.label}>NEXT</h3>
      <div className={styles.preview}>
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`${styles.cell} ${cell ? styles.filled : styles.empty}`}
              style={
                cell
                  ? {
                      '--cell-color': cell.color,
                      '--cell-shadow': cell.shadowColor,
                    }
                  : {}
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;
