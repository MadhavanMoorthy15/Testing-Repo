# spec-driven-dev-guide

A sample repository demonstrating a spec-first (OpenSpec) development workflow with React + Vite reference applications.

## 🎯 Reference Applications

This repository contains **two complete reference applications** built using the OpenSpec spec-driven workflow:

### 1. Voice Notes App
A voice note-taking application with AI enhancement features, SQLite persistence, and rich text editing.
- **Location**: `/voice-notes-app/`
- **Tech**: React + Vite + Syncfusion Components + sql.js

### 2. E-commerce App (ShopHub) 🆕
A full-featured online shopping platform with product catalog, shopping cart, wishlist, and user authentication.
- **Location**: `/ecommerce-app/`
- **Tech**: React + Vite + TypeScript + React Router
- **Documentation**: [ECOMMERCE_PROJECT.md](ECOMMERCE_PROJECT.md)

---

## Quick Start

### Voice Notes App

**Requirements:** Node.js (LTS recommended) and `npm` or `pnpm` installed.

```bash
cd voice-notes-app
npm install
npm run dev
```

### E-commerce App (ShopHub)

```bash
cd ecommerce-app
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## What this repo contains

- **ecommerce-app/** 🆕: Full e-commerce application driven by OpenSpec specifications
- **voice-notes-app/**: Voice note-taking reference implementation
- **front-end-design/**: Static design artifacts and examples
- **openspec/**: Change proposals and specifications for the spec-driven workflow

---

## Understanding OpenSpec Specs

The `openspec/specs/` directory contains feature-level specifications that drive implementation. See files for detailed requirements and scenarios for each module.

---

## Voice Notes App: Additional Developer Information

- App entry: [voice-notes-app/src/main.tsx](voice-notes-app/src/main.tsx)
- Scripts & deps: [voice-notes-app/package.json](voice-notes-app/package.json)
- Settings sync:
    - User settings (theme, font size) are persisted to SQLite and to localStorage
    - Settings are loaded from the DB when a user logs in; updates are saved to both
- Auth and Settings:
    - Authentication state is persisted to localStorage (key: `SyncNotess_user_id`)
    - User profile allows editing username; profile picture update is not yet implemented (button present, non-functional by spec)
    - Change password modal available in Profile view, but serverless only (passwords locally hashed)
- Features:
    - Voice recording is browser-only: audio is never stored, only transcript is processed
    - Smart Write AI requires OpenRouter key in `.env`; error shown if missing
    - Note editor saves after 2s inactivity and on Ctrl+S (manual save)
    - FAB on home menu opens actions for new voice or text note (checklist is a placeholder per the spec)
- Accessibility & Responsive:
    - All interactive elements are keyboard-accessible and have appropriate ARIA labels
    - Mobile and desktop layouts are based on the pixel-perfect static design in `front-end-design/`

---

## Recent Out-of-Date Documentation Sections (now updated)

- Expanded project-level README Voice Notes App section for clarity (settings, profile, password, Smart Write specifics, checklist placeholder callout, accessibility and local persistence)
- Confirmed checklist in FAB and ContentTabs remains a UI placeholder, not functional, matching the requirements
- Synced documentation with the addition of settings persistence, Smart Write error flows, and local credential/persistence flows

---

## License

See individual app directories for license information.

---

Built with ❤️ using OpenSpec spec-driven development workflow
