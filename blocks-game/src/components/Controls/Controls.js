import React from 'react';
import styles from './Controls.module.css';

/**
 * On-screen touch controls — visible only on mobile (hidden via CSS on desktop).
 * Supports touch AND click events.
 */
const Controls = ({ onLeft, onRight, onRotate, onSoftDrop, onHardDrop }) => {
  const bind = (handler) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      handler();
    },
  });

  return (
    <div className={styles.controls}>
      {/* Top row: Rotate (CCW placeholder) | Hard Drop | Rotate CW */}
      <div className={styles.topRow}>
        <button
          className={`${styles.btn} ${styles.hardDropBtn}`}
          aria-label="Hard Drop"
          {...bind(onHardDrop)}
        >
          ⬇
        </button>
        <button
          className={`${styles.btn} ${styles.rotateBtn}`}
          aria-label="Rotate"
          {...bind(onRotate)}
        >
          ↻
        </button>
      </div>

      {/* Bottom row: Left | Down | Right */}
      <div className={styles.bottomRow}>
        <button
          className={`${styles.btn} ${styles.dirBtn}`}
          aria-label="Move Left"
          {...bind(onLeft)}
        >
          ◀
        </button>
        <button
          className={`${styles.btn} ${styles.dirBtn}`}
          aria-label="Soft Drop"
          {...bind(onSoftDrop)}
        >
          ▼
        </button>
        <button
          className={`${styles.btn} ${styles.dirBtn}`}
          aria-label="Move Right"
          {...bind(onRight)}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Controls;
