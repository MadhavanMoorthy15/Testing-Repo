
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

### 3. Atelier Form App 🆕
A multi-step commission request form for a fictional joinery studio, demonstrating schema-driven fields, self-explaining validation, focus management, and draft persistence.
- **Location**: `/atelier-form-app/`
- **Tech**: React + Vite + TypeScript + CSS Modules
- **Specs**: `openspec/specs/commission-form/`, `openspec/specs/form-draft/`, `openspec/specs/form-submission/`

---

## Quick Start

### Voice Notes App

**Requirements:** Node.js (LTS recommended) and `npm` or `pnpm` installed.

```bash
cd voice-notes-app
npm install
npm run dev
```

### Atelier Form App

```bash
cd atelier-form-app
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

- **atelier-form-app/** 🆕: Multi-step commission request form
  - Schema-driven fields — one definition drives rendering, validation, the review summary, and the draft
  - Self-explaining validation with an error summary and focus management
  - Autosaved drafts in `localStorage`, restored on return
  - Review summary, consent gate, and submission confirmation
  - See [atelier-form-app/README.md](atelier-form-app/README.md) for full documentation

- **ecommerce-app/** 🆕: Full e-commerce application with OpenSpec specifications
  - Complete product catalog with filtering and search
  - Shopping cart with real-time calculations
  - User authentication and session management
  - Wishlist functionality
  - Responsive design (mobile, tablet, desktop)
  - See [ECOMMERCE_PROJECT.md](ECOMMERCE_PROJECT.md) for full documentation

- **voice-notes-app/**: Voice note-taking reference implementation
  - App entry: [voice-notes-app/src/main.tsx](voice-notes-app/src/main.tsx)
  - Scripts & deps: [voice-notes-app/package.json](voice-notes-app/package.json)

- **front-end-design/**: Design examples and static HTML/CSS/JS mockups for screens

- **openspec/**: Change proposals and specifications used by the spec-driven workflow
  - **Voice Notes specs**: Original OpenSpec specifications for the voice notes app
  - **E-commerce specs** 🆕: Complete specifications for the e-commerce platform
    - `ecommerce-app-shell/` - Application infrastructure
    - `ecommerce-product-catalog/` - Product features
    - `ecommerce-shopping-cart/` - Cart management
    - `ecommerce-checkout/` - Purchase flow
    - `ecommerce-user-account/` - User management
    - `ecommerce-order-management/` - Order lifecycle

---

## Understanding OpenSpec Specs

The `openspec/specs/` directory contains feature-level specifications that drive implementation. Each spec file defines the requirements, acceptance criteria, and behaviors for a feature.

### Voice Notes App Specs

- **app-shell/spec.md** — Core app infrastructure: React Router setup, Syncfusion theme integration, responsive layout, database context, and global CSS variables
- **auth-flow/spec.md** — User authentication: sign-up, sign-in, OAuth, and session management
- **home-dashboard/spec.md** — Home screen: note grid, search bar, sidebar, bottom navigation, and floating action button
- **note-editor/spec.md** — Rich text editor: title input, content editing, tags, pin/unpin, Smart Write toggle, and auto-save
- **voice-recorder/spec.md** — Voice recording: audio capture, waveform display, transcription, and note creation
- **settings-management/spec.md** — User settings: appearance, profile, and preferences
- **onboarding/spec.md** — First-time user flow: welcome slides and app introduction
- **data-persistence/spec.md** — Local storage: SQLite database (via sql.js) and data migration
- **smart-write-ai/spec.md** — AI-powered features: text refinement and content suggestions via external API

### E-commerce App Specs 🆕

- **ecommerce-app-shell/spec.md** — React Router, responsive layout, header/footer, context providers
- **ecommerce-product-catalog/spec.md** — Product listing, filtering, search, detail pages, categories
- **ecommerce-shopping-cart/spec.md** — Cart operations, calculations, persistence, stock validation
- **ecommerce-checkout/spec.md** — Multi-step checkout, shipping, payment, order placement
- **ecommerce-user-account/spec.md** — Authentication, profile, addresses, order history
- **ecommerce-order-management/spec.md** — Order tracking, status updates, cancellation, invoices

### Atelier Form App Specs 🆕

- **commission-form/spec.md** — Step model, schema-driven field rendering, per-step validation, inline errors, error summary and focus management, and the rule set
- **form-draft/spec.md** — Autosaving, restoring, and clearing the in-progress form state
- **form-submission/spec.md** — Review summary, consent gate, submission, and the confirmation reference

---

## How specs work

Each spec uses a **BDD-style format** with:
- **Requirements** — What the feature SHALL do
- **Scenarios** — Given/When/Then examples showing expected behavior

This ensures that implementation is measurable and testable against the spec.

**Example from E-commerce Shopping Cart Spec:**

```markdown
### Requirement: Add to cart functionality
The application SHALL allow users to add products to cart from product listing, 
product detail page, and quick view modal.

#### Scenario: Add product to cart
- **WHEN** user clicks "Add to Cart" on a product
- **THEN** the product is added to cart with quantity 1 and a success toast 
  displays "Product added to cart"
```

---

## E-commerce App Features

### ✅ Implemented
- Product catalog with responsive grid
- Category and price filtering
- Search functionality
- Sort by price, name, rating
- Shopping cart with CRUD operations
- Real-time calculations (subtotal, tax, shipping)
- Free shipping over $50
- User authentication (sign up, sign in, logout)
- Session persistence
- Wishlist with heart icon toggle
- Mobile-responsive design

### 📋 Spec-Defined (Ready to Implement)
- Product detail page with image gallery
- Multi-step checkout flow
- Payment method selection
- Order management and tracking
- User profile and address management
- Product reviews and ratings
- Order history and re-ordering

See [ECOMMERCE_PROJECT.md](ECOMMERCE_PROJECT.md) for complete documentation.

---

## Useful files

- [openspec/specs/](openspec/specs/) — all feature specifications organized by feature
- [front-end-design/](front-end-design/) — static design artifacts and examples
- [ECOMMERCE_PROJECT.md](ECOMMERCE_PROJECT.md) — Complete e-commerce app documentation
- [REQUIREMENTS.md](REQUIREMENTS.md) — Voice Notes app requirements

---

## Tech Stack Comparison

| Feature | Voice Notes | E-commerce | Atelier Form |
|---------|-------------|------------|---------------|
| Framework | React 19 + TypeScript | React 19 + TypeScript | React 19 + TypeScript |
| Build Tool | Vite 8 | Vite 8 | Vite 8 |
| Routing | React Router | React Router DOM | None (single view) |
| UI Components | Syncfusion | Custom CSS | Custom CSS (CSS Modules) |
| State Management | Context API | Context API | Context API + Reducer |
| Data Persistence | sql.js (SQLite) | localStorage | localStorage (drafts) |
| Styling | CSS + Syncfusion Theme | Pure CSS3 | CSS Modules |

---

## Learning Paths

### For Spec-Driven Development
1. Read OpenSpec specifications in `/openspec/specs/`
2. Study how specs translate to code implementation
3. Compare Voice Notes vs E-commerce approaches
4. Practice writing your own BDD scenarios

### For React Development
1. Explore Context API usage in both apps
2. Study component architecture patterns
3. Review TypeScript type definitions
4. Analyze routing and navigation patterns

### For E-commerce Development
1. Start with [ECOMMERCE_PROJECT.md](ECOMMERCE_PROJECT.md)
2. Run the app and test features
3. Review OpenSpec specifications
4. Implement missing features (checkout, orders, etc.)

---

## Contributing

When adding features to either application:

1. **Start with the spec** - Write or review the OpenSpec specification first
2. **Define scenarios** - Use Given/When/Then format for acceptance criteria
3. **Implement** - Code according to the spec
4. **Verify** - Ensure all scenarios pass

---

## License

See individual app directories for license information.

---

Built with ❤️ using OpenSpec spec-driven development workflow
