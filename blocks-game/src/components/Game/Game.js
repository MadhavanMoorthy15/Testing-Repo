import React from 'react';
import styles from './Game.module.css';
import useGameLogic from '../../hooks/useGameLogic';

import Board from '../Board/Board';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import NextPiece from '../NextPiece/NextPiece';
import Controls from '../Controls/Controls';
import Overlay from '../Overlay/Overlay';

const Game = () => {
  const {
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
  } = useGameLogic();

  return (
    <div className={styles.gameContainer}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.title}>BLOCKS</h1>
      </header>

      {/* ── Play area ── */}
      <div className={styles.playArea}>
        {/* Left sidebar */}
        <aside className={styles.sidebar}>
          <ScoreBoard
            score={score}
            lines={lines}
            level={level}
            highScore={highScore}
          />
        </aside>

        {/* Board */}
        <section className={styles.boardSection}>
          <div className={styles.boardRelative}>
            <Board
              board={board}
              currentPiece={currentPiece}
              ghostY={ghostY}
            />
            {/* Overlay renders on top of the board */}
            <Overlay
              gameStatus={gameStatus}
              score={score}
              highScore={highScore}
              onStart={startGame}
              onResume={togglePause}
              onReset={resetGame}
            />
          </div>

          {/* Pause / Resume button (desktop) */}
          {gameStatus !== 'idle' && gameStatus !== 'gameOver' && (
            <button className={styles.pauseBtn} onClick={togglePause}>
              {gameStatus === 'paused' ? '▶ RESUME' : '⏸ PAUSE'}
            </button>
          )}

          {/* Mobile on-screen controls */}
          <Controls
            onLeft={moveLeft}
            onRight={moveRight}
            onRotate={rotatePieceCW}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
          />
        </section>

        {/* Right sidebar */}
        <aside className={styles.sidebar}>
          <NextPiece piece={nextPiece} />

          <div className={styles.levelBadge}>
            <span className={styles.levelLabel}>LEVEL</span>
            <span className={styles.levelValue}>{level}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Game;
