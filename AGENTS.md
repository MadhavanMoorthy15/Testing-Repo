# AGENTS.md

This file provides guidance for AI agents working in this repository. It describes the repository structure, conventions, workflows, and rules to follow when making changes.

---

## Repository Overview

This is a **spec-driven development** reference repository demonstrating the OpenSpec workflow. It contains two complete reference applications and their associated specifications, design artifacts, and change proposals.

### Applications

| App | Location | Tech Stack | Status |
|-----|----------|------------|--------|
| Voice Notes App | `/voice-notes-app/` | React 19 + TypeScript + Vite + Syncfusion + sql.js | Implemented |
| E-commerce App (ShopHub) | `/ecommerce-app/` | React 19 + TypeScript + Vite + React Router DOM | Partially Implemented |
| Todo List App | `/todo-list-app/` | Vanilla HTML/CSS/JS | Implemented |

---

## Directory Structure

```
/
├── AGENTS.md                    # This file
├── README.md                    # Repository overview
├── REQUIREMENTS.md              # Voice Notes app requirements
├── ECOMMERCE_PROJECT.md         # E-commerce app documentation
│
├── front-end-design/            # Static HTML/CSS/JS design prototypes
│   ├── auth/                    # Authentication screen mockups
│   ├── home/                    # Home dashboard mockups
│   ├── note/                    # Note editor & recorder mockups
│   ├── onboarding/              # Onboarding carousel mockups
│   └── settings/                # Settings screen mockups
│
├── openspec/                    # OpenSpec workflow artifacts
│   ├── config.yaml              # OpenSpec configuration
│   ├── specs/                   # Feature-level specifications
│   │   ├── app-shell/
│   │   ├── auth-flow/
│   │   ├── data-persistence/
│   │   ├── ecommerce-app-shell/
│   │   ├── ecommerce-checkout/
│   │   ├── ecommerce-order-management/
│   │   ├── ecommerce-product-catalog/
│   │   ├── ecommerce-shopping-cart/
│   │   ├── ecommerce-user-account/
│   │   ├── home-dashboard/
│   │   ├── note-editor/
│   │   ├── onboarding/
│   │   ├── settings-management/
│   │   ├── smart-write-ai/
│   │   └── voice-recorder/
│   └── changes/                 # Change proposals (active and archived)
│       ├── todo-list-ui/        # Active change
│       └── archive/             # Completed changes
│
├── todo-list-app/               # Vanilla JS todo list application
└── voice-notes-app/             # React voice notes application
    └── src/
        ├── components/          # React components by feature
        ├── contexts/            # React Context providers
        ├── db/                  # SQLite database layer
        ├── hooks/               # Custom React hooks
        ├── pages/               # Page-level components
        ├── services/            # External API services
        ├── styles/              # Global styles and overrides
        ├── types/               # TypeScript type definitions
        └── utils/               # Utility functions
```

---

## OpenSpec Workflow

This repository uses the **OpenSpec spec-driven development** workflow. Always follow this process when making changes:

### 1. Spec First
Before writing any code, ensure a spec exists in `openspec/specs/<feature-name>/spec.md`. Specs use BDD-style format:
- **Requirements** — What the feature SHALL do
- **Scenarios** — Given/When/Then acceptance criteria

### 2. Change Proposals
Active changes live in `openspec/changes/<change-name>/` and contain:
- `proposal.md` — Why, what, and impact of the change
- `design.md` — UI/UX design decisions
- `tasks.md` — Breakdown of implementation tasks
- `specs/` — Delta specs for new or modified capabilities

### 3. Implementation
Implement according to the spec. Each task in `tasks.md` should map to a discrete, verifiable unit of work.

### 4. Archive
Completed changes are moved to `openspec/changes/archive/`.

### Active Changes
- **`todo-list-ui`** — Todo list application with task management and completion UI

---

## Coding Conventions

### General
- Use **TypeScript** for all React application code
- Follow **mobile-first** responsive design (breakpoints: 768px tablet, 1024px desktop)
- Use **semantic HTML** elements (`<nav>`, `<main>`, `<section>`, `<article>`) — avoid generic `<div>` wrappers where a semantic element fits
- Ensure all interactive elements have **visible focus indicators**
- Maintain a minimum **touch target size of 44×44px** for interactive elements

### React (Voice Notes App & E-commerce App)
- Use **React Context API** for global state — no external state management libraries
- Co-locate component CSS modules with their component files (e.g., `Button.tsx` + `button.module.css`)
- Page components live in `src/pages/`, reusable components in `src/components/`
- Use **custom hooks** in `src/hooks/` for reusable stateful logic
- TypeScript interfaces and types go in `src/types/index.ts`

### CSS / Styling
- Use **CSS custom properties** (design tokens) defined in `src/styles/variables.css`
- Follow the project's **typography scale** for headings and body text
- Voice Notes App color palette: `--color-primary: #2D5BFF`
- E-commerce App color palette: Primary `#FF6B35`, Secondary `#004E89`, Success `#00A896`
- E-commerce spacing base unit: `8px` (scale: `0.5rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`)
- E-commerce border radius: Small `6px`, Medium `8px`, Large `12px`

### Vanilla JS (Todo List App)
- Plain HTML/CSS/JS — no frameworks or build tools
- Use `localStorage` for data persistence
- Keep files in `/todo-list-app/`

---

## Tech Stack Reference

### Voice Notes App (`/voice-notes-app/`)
| Concern | Technology |
|---------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| UI Components | Syncfusion React Components |
| Routing | React Router |
| Database | sql.js (SQLite via WASM) + IndexedDB |
| Voice | Web Speech API (browser-native) |
| AI | OpenRouter API (GPT-4.1) via `src/services/openRouterApi.ts` |
| State | React Context API |

### E-commerce App (`/ecommerce-app/`)
| Concern | Technology |
|---------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Routing | React Router DOM |
| Styling | Pure CSS3 with CSS Variables |
| State | React Context API |
| Persistence | localStorage |

---

## Running the Applications

### Voice Notes App
```bash
cd voice-notes-app
npm install
npm run dev
# Visit http://localhost:5173
```

### E-commerce App
```bash
cd ecommerce-app
npm install
npm run dev
# Visit http://localhost:5173
```

### Todo List App
Open `todo-list-app/index.html` directly in a browser — no build step required.

---

## Key Constraints & Rules

1. **Voice recordings are NEVER stored** — only text transcripts are saved (Voice Notes App).
2. **No backend** — both apps are fully client-side; no server required.
3. **OAuth buttons are UI placeholders** — no real OAuth implementation.
4. **Web Speech API** works best in Chrome/Edge; may not work in all browsers.
5. **Checklist feature** in Voice Notes is a UI placeholder only.
6. **Data is local-only** — clearing browser data will erase all user data.
7. **Do not introduce external CSS frameworks** (e.g., Tailwind, Bootstrap) to the E-commerce App — it uses pure CSS3.
8. **Do not introduce external state management libraries** (e.g., Redux, Zustand) — use React Context API.

---

## Design Standards

All UI work must follow these standards (from `.codestudio/instructions/design-standards.instructions.md`):

- Use **semantic HTML** elements instead of generic `<div>` wrappers
- Follow the **color palette** defined in design tokens / CSS variables
- Ensure all interactive elements have **visible focus indicators**
- Use **responsive, mobile-first** design patterns
- Maintain a minimum **touch target size of 44×44px** for interactive elements
- Follow the project's **typography scale** for headings and body text

---

## Front-End Design Prototypes

The `front-end-design/` directory contains static HTML/CSS/JS prototypes that serve as the **pixel-perfect design source** for the Voice Notes App. When implementing or modifying UI:

1. Reference the corresponding prototype in `front-end-design/`
2. Replicate the design using Syncfusion React components
3. Use the CSS custom properties from the prototype (e.g., `--color-primary: #2D5BFF`)

| Prototype | Target Implementation |
|-----------|----------------------|
| `front-end-design/auth/` | `voice-notes-app/src/components/auth/` |
| `front-end-design/onboarding/` | `voice-notes-app/src/components/onboarding/` |
| `front-end-design/home/` | `voice-notes-app/src/components/home/` |
| `front-end-design/note/recorder.*` | `voice-notes-app/src/components/note/` (recorder) |
| `front-end-design/note/editor.*` | `voice-notes-app/src/components/note/` (editor) |
| `front-end-design/settings/` | `voice-notes-app/src/components/settings/` |

---

## Database Schema (Voice Notes App)

```sql
users       (id, name, email, password_hash, avatar_url, created_at)
notes       (id, user_id, title, content, is_pinned, created_at, updated_at)
tags        (id, name, color)
note_tags   (note_id, tag_id)   -- many-to-many
settings    (user_id, theme, font_size)
```

- Data is persisted to **IndexedDB** after every write and loaded on app startup.
- Auto-save triggers after **2 seconds of inactivity** in the note editor.

---

## E-commerce State Management

Three Context providers manage global state:

| Context | File | Responsibility |
|---------|------|----------------|
| `AuthContext` | `src/contexts/AuthContext.tsx` | User auth, login/logout, session persistence |
| `CartContext` | `src/contexts/CartContext.tsx` | Cart items, CRUD, calculations |
| `WishlistContext` | `src/contexts/WishlistContext.tsx` | Wishlist items, toggle |

Cart calculations: subtotal + 8% tax + $5.99 shipping (FREE over $50).

---

## Spec-Defined Features (Ready to Implement)

The following features have complete OpenSpec specifications but are not yet implemented. Implement them by following the corresponding spec in `openspec/specs/`:

- **Product Detail Page** — image gallery, specifications, add to cart, related products
- **Checkout Flow** — multi-step (Shipping → Payment → Review), promo codes, guest checkout
- **User Account Dashboard** — profile management, address management, order history
- **Order Management** — order tracking, status updates, cancellation, re-order, invoices
- **Product Reviews & Ratings** — user review submission and display

---

## Adding New Features

1. **Write or update the spec** in `openspec/specs/<feature>/spec.md`
2. **Create a change proposal** in `openspec/changes/<change-name>/proposal.md`
3. **Define tasks** in `openspec/changes/<change-name>/tasks.md`
4. **Implement** following the spec's requirements and scenarios
5. **Verify** all Given/When/Then scenarios pass
6. **Archive** the change to `openspec/changes/archive/`
