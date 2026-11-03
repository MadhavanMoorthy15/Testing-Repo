# Voice Notes App

A browser-based voice note-taking app with AI enhancement, SQLite persistence, and rich text editing. This app is implemented spec-first, referencing the static designs in `front-end-design/` and OpenSpec specifications.

---

## Key Features
- **Voice transcription** (Web Speech API, transcript only, does not save audio)
- **Note editor**: Syncfusion RichTextEditor, Smart Write AI enhancement, tags
- **Home dashboard**: Pinned notes, quick search w/ debounce, floating action button
- **Settings**: Appearance (theme, font size), profile (edit name, change password), all persisted to SQLite + localStorage
- **Authentication**: Email+password, session persisted locally (no backend); OAuth buttons are UI only
- **Offline/data durability**: Notes and settings persist across browser restarts (IndexedDB via sql.js)
- **Accessibility**: All interactive elements have ARIA labels and keyboard navigation

---

## Usage
To run the app:
1. Install dependencies: `npm install`
2. Start the app: `npm run dev`

---

## Additional Details
- **Checklist** in FAB menu and home tabs is a UI placeholder as documented in spec (not functional)
- **Smart Write** uses OpenRouter GPT-4.1 (API key required in `.env`, see error if missing)
- **Passwords** are locally hashed, everything is stored in-browser
- **Settings sync**: theme/font are synced to SQLite and localStorage, loaded when user logs in
- **Profile image upload**: Button is non-functional per requirements (see spec)
- **Error handling**: Displays errors on auth, Smart Write, password, or settings updates
- **Strict local-first/data safety**: Clearing browser data will lose all notes/settings/accounts

---

## Synced Documentation Changes
- Checklist feature confirmed as visible UI component, not implemented (requirement unchanged)
- Settings changes and Smart Write AI error handling now reflected in this README
- Settings load & persist logic clarified (SQLite DB + localStorage sync on login/change)
- OAuth, Profile photo: clarified as placeholders per constraints
- Data and credential flows updated for local-only, client-side operation

---

## For full requirements/specs:
- [../REQUIREMENTS.md](../REQUIREMENTS.md) (summary)
- [../openspec/changes/archive/2026-03-27-voice-notes-web-app/specs/](../openspec/changes/archive/2026-03-27-voice-notes-web-app/specs/) (complete specs)

---

## License
MIT (see repo root)
