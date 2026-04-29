import React from 'react';
import styles from './Overlay.module.css';

const Overlay = ({ gameStatus, score, highScore, onStart, onResume, onReset }) => {
  if (gameStatus === 'running') return null;

  // ── Welcome / Start Screen ──────────────────────────────────────────────────
  if (gameStatus === 'idle') {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* Animated logo */}
          <div className={styles.logo}>
            <span className={styles.logoB}>B</span>
            <span className={styles.logoL}>L</span>
            <span className={styles.logoO}>O</span>
            <span className={styles.logoC}>C</span>
            <span className={styles.logoK}>K</span>
            <span className={styles.logoS}>S</span>
          </div>
          <p className={styles.subtitle}>FALLING BLOCKS PUZZLE</p>

          {/* Keyboard hints */}
          <div className={styles.keysHint}>
            {[
              { keys: ['←', '→'], action: 'Move' },
              { keys: ['↑', 'X'], action: 'Rotate CW' },
              { keys: ['Z'], action: 'Rotate CCW' },
              { keys: ['↓'], action: 'Soft drop' },
              { keys: ['SPACE'], action: 'Hard drop' },
              { keys: ['P', 'ESC'], action: 'Pause' },
            ].map(({ keys, action }) => (
              <div key={action} className={styles.keyHint}>
                <span className={styles.keys}>
                  {keys.map((k) => (
                    <kbd key={k} className={styles.key}>{k}</kbd>
                  ))}
                </span>
                <span className={styles.keyAction}>{action}</span>
              </div>
            ))}
          </div>

          <div className={styles.btnGroup}>
            <button className={styles.primaryBtn} onClick={onStart}>
              START GAME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Paused ──────────────────────────────────────────────────────────────────
  if (gameStatus === 'paused') {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>PAUSED</h2>
          <p className={styles.scoreDisplay}>Score: {score.toLocaleString()}</p>
          <div className={styles.btnGroup}>
            <button className={styles.primaryBtn} onClick={onResume}>
              RESUME
            </button>
            <button className={styles.secondaryBtn} onClick={onReset}>
              QUIT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Game Over ───────────────────────────────────────────────────────────────
  if (gameStatus === 'gameOver') {
    const isNewRecord = score > 0 && score >= highScore;
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={`${styles.title} ${styles.gameOverTitle}`}>GAME OVER</h2>

          <div className={styles.finalScores}>
            <div className={styles.finalScoreRow}>
              <span className={styles.finalLabel}>SCORE</span>
              <span className={styles.finalValue}>{score.toLocaleString()}</span>
            </div>
            <div className={styles.finalScoreRow}>
              <span className={styles.finalLabel}>BEST</span>
              <span className={`${styles.finalValue} ${styles.bestValue}`}>
                {highScore.toLocaleString()}
              </span>
            </div>
          </div>

          {isNewRecord && (
            <p className={styles.newRecord}>★ NEW HIGH SCORE! ★</p>
          )}

          <div className={styles.btnGroup}>
            <button className={styles.primaryBtn} onClick={onStart}>
              PLAY AGAIN
            </button>
            <button className={styles.secondaryBtn} onClick={onReset}>
              MAIN MENU
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Overlay;
