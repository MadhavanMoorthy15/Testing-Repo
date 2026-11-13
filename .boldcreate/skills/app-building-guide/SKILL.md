---
name: app-building-guide
description: The map of this repository's app-building skills and the order to use them. Use when the user asks what to do next in an app, wants an overview of how to build in this repository, or asks which skill to use for a task.
license: MIT
---

# Build in this repository

This repository holds two reference applications built the same way: React 19, TypeScript,
Vite, React Router, the Context API, CSS modules with design tokens, a SQLite database
through `sql.js`, and Vitest for tests. A third app follows the same shape.

## The order of work

| Step | Skill | What it does |
|---|---|---|
| 1 | `build-react-app` | Writes the folder, the config and the first test |
| 2 | `spec-driven-feature` | Turns the requirement and its scenarios into code and tests |
| 3 | `react-component-ui` | Builds the components with the tokens and the CSS modules |
| 4 | `react-state-context` | Shares state through a provider |
| 5 | `data-persistence-layer` | Stores the data in SQLite and reads it through a repository |
| 6 | `react-routing-pages` | Adds the routes and the pages |
| 7 | `api-service-client` | Calls a network API from a service module |
| 8 | `local-storage-session` | Keeps the session and the preferences between sessions |
| 9 | `responsive-app-shell` | Builds the frame: header, sidebar, bottom navigation |
| 10 | `app-testing-vitest` | Writes the test for each scenario and runs the suite |

## The apps

| App | Folder | Holds |
|---|---|---|
| Voice Notes | `voice-notes-app/` | The full app: auth, notes, tags, settings, recorder |
| ShopHub | `ecommerce-app/` | The e-commerce app: catalog, cart, checkout, orders |
| Calculator | `calculator/` | A small app with a test suite, useful as a reference |

`front-end-design/` holds the static HTML, CSS and JavaScript designs the apps follow.

## The specs

`openspec/specs/<feature>/spec.md` holds the requirement and the scenarios for a feature.
The specs are the contract: the code and the tests follow them.

```markdown
### Requirement: Add to cart functionality
The application SHALL allow users to add products to cart from product listing.

#### Scenario: Add product to cart
- **WHEN** user clicks "Add to Cart" on a product
- **THEN** the product is added to cart with quantity 1
```

Read the spec before writing the code. Every scenario gets a test.

## The folders

```
src/
├── components/<area>/   UI components, one file per component
├── contexts/            one provider per shared concern
├── db/                  the connection, the schema, the repositories
├── hooks/               reusable stateful logic
├── pages/               one component per route
├── services/            calls to a network API
├── styles/              the design tokens
├── types/               the shared types
└── utils/               pure functions
```

## The commands

Run them inside the app folder.

```bash
npm install     # once
npm run dev     # the app on http://localhost:5173
npm run build   # typecheck and build
npm test        # the test suite
```

## The rules that hold everywhere

- A component holds no data fetching and no business rules.
- A page composes components and reads context.
- A provider owns one concern and the actions that change it.
- A repository owns the queries and never returns a raw row.
- A query always uses a placeholder for a value.
- A test asserts on what the user sees: a role, a label, a visible text.
- A scenario in the spec has a test.
- A key stays in an environment variable, and the `.env` file is never committed.

## The skill structure

Every skill in this folder is a directory with a `SKILL.md` in it. The header names the
skill and says when to use it. The body holds the steps, the rules and the examples.

The `yaml-*` skills cover the frontmatter of a `SKILL.md`: one broken header each, and what
to do about it. Read `yaml-skill-frontmatter` when a skill does not load.
