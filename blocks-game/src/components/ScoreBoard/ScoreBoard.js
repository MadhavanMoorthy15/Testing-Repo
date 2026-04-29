import React from 'react';
import styles from './ScoreBoard.module.css';

const StatBox = ({ label, value }) => (
  <div className={styles.statBox}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue}>{value.toLocaleString()}</span>
  </div>
);

const ScoreBoard = ({ score, lines, level, highScore }) => {
  return (
    <div className={styles.container}>
      <StatBox label="SCORE" value={score} />
      <StatBox label="BEST" value={highScore} />
      <StatBox label="LINES" value={lines} />
      <StatBox label="LEVEL" value={level} />
    </div>
  );
};

export default ScoreBoard;
