---
name: build-react-app
description: Scaffold a new React and TypeScript app in this repository with Vite, routing, the Context API, CSS design tokens and a Vitest test setup. Use when the user asks to start a new app, create a new project, or set up a React app that follows the conventions of this repository.
license: MIT
---

# Build a React app

A new app in this repository follows the shape of `voice-notes-app`: React 19, TypeScript, Vite,
React Router, the Context API for state, CSS custom properties for theming, and Vitest for
tests.

## Steps

1. **Choose the folder name.** It becomes the app folder, the `package.json` name and the
   database name. Use a lowercase hyphenated name such as `expense-tracker`.

2. **Copy the scaffold.** Run the script, which writes the whole folder:

   ```bash
   node .boldcreate/skills/build-react-app/scripts/scaffold-app.mjs expense-tracker
   ```

   The script writes `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`,
   `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts` and a first test.
   It never overwrites an existing folder.

3. **Install and check the app builds.**

   ```bash
   cd expense-tracker
   npm install
   npm run build
   npm test
   ```

4. **Wire the feature.** Follow `spec-driven-feature` for the behaviour and
   `react-state-context` for the state.

## The folder layout

```
expense-tracker/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx          # mounts the app
    ├── App.tsx           # providers and routes
    ├── index.css         # design tokens and global styles
    ├── components/       # UI components, one folder per feature area
    ├── contexts/         # one provider per shared concern
    ├── pages/            # one component per route
    ├── hooks/            # reusable stateful logic
    ├── services/         # calls to a network API
    ├── types/            # shared TypeScript types
    └── utils/            # pure functions
```

## Rules

- One provider per shared concern. A provider owns its state and the actions that change it.
- A page is a route. It composes components and reads context. It holds no business rules.
- A repository or service owns data access. A component never calls the database directly.
- Types live in `src/types`, not in the component that first needed them.
- A pure helper lives in `src/utils` and has no React import.

## What the script writes

| File | What it holds |
|---|---|
| `package.json` | React, React Router, Vite, Vitest and the scripts |
| `tsconfig.json` | Strict mode, the bundler module resolution, the path alias |
| `vite.config.ts` | The React plugin, the Vitest config, the alias |
| `index.html` | The root element and the font |
| `src/main.tsx` | Mounts `App` inside `StrictMode` |
| `src/App.tsx` | The providers and the routes |
| `src/index.css` | The design tokens and the global styles |
| `src/App.test.tsx` | The first test, so the setup is proven |

## After the scaffold

- Add the app to the root `README.md` under the reference applications.
- Add its specs under `openspec/specs/<feature>/spec.md`.
- Keep the scripts of the new app the same as the ones the script writes, so every app in
  the repository runs the same commands.
