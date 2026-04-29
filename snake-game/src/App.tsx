import React from 'react';
import './App.css';
import DPad from './DPad';
import GameBoard from './GameBoard';
import { useSnakeGame } from './useSnakeGame';

const App: React.FC = () => {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    start,
    pause,
    reset,
    changeDirection,
  } = useSnakeGame();

  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';
  const isIdle = status === 'IDLE';
  const isGameOver = status === 'GAME_OVER';

  return (
    <div className="app">
      {/* Scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      <header className="app-header">
        <h1 className="game-title">
          <span className="title-snake">🐍</span> SNAKE
        </h1>
      </header>

      <div className="scoreboard">
        <div className="score-block">
          <span className="score-label">SCORE</span>
          <span className="score-value">{String(score).padStart(5, '0')}</span>
        </div>
        <div className="score-block">
          <span className="score-label">BEST</span>
          <span className="score-value">{String(highScore).padStart(5, '0')}</span>
        </div>
      </div>

      <div className="board-wrapper">
        <GameBoard snake={snake} food={food} />

        {/* Overlay messages */}
        {isIdle && (
          <div className="overlay">
            <p className="overlay-title">READY?</p>
            <p className="overlay-sub">Use arrow keys / WASD</p>
            <button className="btn-primary" onClick={start}>
              START GAME
            </button>
          </div>
        )}

        {isPaused && (
          <div className="overlay">
            <p className="overlay-title">PAUSED</p>
            <button className="btn-primary" onClick={start}>
              RESUME
            </button>
            <button className="btn-secondary" onClick={reset}>
              NEW GAME
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="overlay">
            <p className="overlay-title game-over-text">GAME OVER</p>
            <p className="overlay-score">Score: {score}</p>
            {score === highScore && score > 0 && (
              <p className="overlay-hi">🏆 New High Score!</p>
            )}
            <button className="btn-primary" onClick={() => { reset(); }}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="controls-bar">
        {isRunning && (
          <button className="btn-control" onClick={pause}>
            ⏸ PAUSE
          </button>
        )}
        {isPaused && (
          <button className="btn-control" onClick={start}>
            ▶ RESUME
          </button>
        )}
        {(isRunning || isPaused) && (
          <button className="btn-control" onClick={reset}>
            ↺ RESTART
          </button>
        )}
      </div>

      {/* Touch D-Pad for mobile */}
      <DPad onDirection={changeDirection} />

      <footer className="app-footer">
        <span>SPACE / ESC to pause &nbsp;|&nbsp; Arrow keys / WASD to move</span>
      </footer>
    </div>
  );
};

export default App;
