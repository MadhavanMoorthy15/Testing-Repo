# 🎮 Blocks Game

A Tetris-style falling blocks puzzle game built with **React 18** — fully playable in the browser.

---

## Features

| Feature | Details |
|---|---|
| 7 Tetromino pieces | I, O, T, S, Z, J, L — each with a unique neon color |
| Ghost piece | Shows where the piece will land |
| Wall-kick / SRS | Simplified Super Rotation System for smooth rotation |
| Scoring | Line clears scale with level; soft-drop & hard-drop bonuses |
| Levels | Speed increases every 10 lines cleared |
| High score | Persisted in `localStorage` |
| Pause / Resume | Keyboard (`P` / `ESC`) and on-screen button |
| Mobile controls | On-screen D-pad visible on small screens |
| Animated UI | Neon glow, shimmer title, game-over glitch effect |

---

## Controls

| Key | Action |
|---|---|
| `←` / `→` | Move left / right |
| `↑` or `X` | Rotate clockwise |
| `Z` | Rotate counter-clockwise |
| `↓` | Soft drop (1 pt/cell) |
| `Space` | Hard drop (2 pts/cell) |
| `P` / `Escape` | Pause / Resume |

---

## Project Structure

```
blocks-game/
├── public/
│   └── index.html
└── src/
    ├── index.js               # React entry point
    ├── index.css              # Global reset & body styles
    ├── App.js
    ├── App.css
    ├── constants/
    │   ├── tetrominos.js      # All 7 tetromino shapes & colors
    │   └── gameConfig.js      # Board dimensions, scoring, speeds
    ├── hooks/
    │   └── useGameLogic.js    # All game state, physics & keyboard input
    └── components/
        ├── Game/              # Root game layout component
        ├── Board/             # 10×20 grid renderer (active + ghost + locked)
        ├── ScoreBoard/        # Score, best, lines, level stats
        ├── NextPiece/         # Next piece preview
        ├── Controls/          # Mobile on-screen buttons
        └── Overlay/           # Start / Pause / Game-over screens
```

---

## Getting Started

### 1. Install dependencies

```bash
cd blocks-game
npm install
```

### 2. Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
```

The optimised bundle is output to `build/`.
