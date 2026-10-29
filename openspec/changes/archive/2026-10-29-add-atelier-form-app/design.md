# Design

## Context

The repository holds two reference applications: `voice-notes-app` (React 19 + TypeScript + Vite 8 + Syncfusion + `sql.js`) and `snake-game` (React 18 + TypeScript + Vite 4, no UI library). Both are feature-shaped: they demonstrate a domain end to end. Neither demonstrates a data-entry surface, which is where most product effort actually goes and where the interesting interaction problems live — partial completion, validation that must explain itself, and the user's expectation that their work survives.

This change adds a third reference application, `atelier-form-app`, built around a multi-step commission request form. It follows the spec-driven workflow the repository already demonstrates: the specs in `openspec/specs/` are the contract, and the implementation is checked against them.

Constraints inherited from the repository:
- The app lives at the repo root as a self-contained directory, like the two existing applications.
- The stack matches the newest existing app (`voice-notes-app`): React 19 + TypeScript + Vite 8, with `vite build` running `tsc` first.
- The repo's design standards apply to everything: semantic HTML elements, design tokens instead of hardcoded values, visible focus indicators, mobile-first responsive layout, and 44×44px minimum touch targets.
- The repository's `frontend-design` skill asks for a committed aesthetic direction rather than generic output, and the `style-checker` skill treats design tokens and accessibility as review criteria.

There is no backend. The application is entirely client-side and persists only a local draft.

## Goals / Non-Goals

**Goals:**
- Model the form once, declaratively, so that a field's label, control, validation rules, and rendering are all driven by a single definition.
- Make validation legible: every failure is explained in place, summarised at the point of failure, and focus is moved to the field that needs attention.
- Make the form safe to interrupt: the user's in-progress answers are autosaved and restorable, and never silently lost.
- Keep the implementation legible to a reader who has not seen it: a small number of well-named modules, no framework beyond React, no dependency that does not earn its place.
- Be verifiable: the validation rules and draft serialisation are covered by unit tests, and the app builds and typechecks clean.

**Non-Goals:**
- A general-purpose form builder, a schema library, or runtime-configurable forms. The schema is a TypeScript constant authored by a developer, not by an end user.
- Server-side submission. The submission is simulated locally so the flow can be exercised end to end without a backend.
- Accounts, authentication, multi-step data that persists server-side, file uploads, or payments.
- Internationalisation beyond a single locale, and no theming engine beyond the one dark palette the design calls for.
- Any change to the two existing applications.

## Decisions

### 1. Framework and styling: React 19 + TypeScript + CSS Modules, no UI library

**Choice:** React 19 with TypeScript, Vite 8, and CSS Modules for styling. No component library.

**Why:** The point of this app is to show form mechanics, and a component library would hide exactly the parts worth showing — how an invalid control is marked, how an error is associated with its field, how focus is managed. Writing those by hand is the demonstration. CSS Modules keep styles scoped per component, which matters in an app with many bespoke controls, and they avoid a runtime CSS-in-JS dependency. This also matches `snake-game`, which likewise uses plain CSS.

**Alternatives considered:** Syncfusion, as used in `voice-notes-app`, would bring a rich set of inputs but reintroduces the problem of hiding the mechanics, and it carries a commercial license key requirement that would block a self-contained reference app. Tailwind was rejected as a runtime-adjacent build dependency for a small app where a token file plus CSS Modules is sufficient.

### 2. Form definition: a typed schema, not a validation library

**Choice:** A `FieldDefinition` union describes each field — `kind`, `name`, `label`, `options`, and a list of `Rule` objects. A `StepDefinition` groups fields and names the step.

**Why:** One definition drives the control that renders, the rules that validate it, the summary that reports it, and the draft that persists it. Because the definitions are ordinary TypeScript, the compiler enforces that each field kind carries the options its control needs, which a JSON schema or a runtime DSL would not. A rule list rather than a single constraint keeps composition explicit and keeps each rule independently testable.

**Alternatives considered:** JSON Schema with Ajv is the standard answer for this shape and was rejected because it splits the definition from the TypeScript types, loses per-field control-kind information, and adds a large dependency for rules this small. Formik and React Hook Form were rejected for the same reason: they solve a much larger problem (arrays, conditional fields, subscriptions, async validation) than this form needs, and would obscure the hand-rolled mechanics the app exists to show.

### 3. Validation: a pure function over `(value, rules)`

**Choice:** `validateField(value, rules)` is a pure function returning a list of error messages. `validateStep(fields, values)` maps it over a step's fields and returns errors keyed by field name.

**Why:** Pure functions are trivially unit-testable without rendering anything, which is what makes the rule set verifiable in isolation. Keeping validation independent of rendering also means the same code validates a step on "Continue", validates the whole form before submission, and validates a restored draft on load — one implementation, three call sites, no drift.

**Rules supported:** `required`, `minLength`, `maxLength`, `email`, `url`, `min`, `max`, and `minSelected` (for checkbox groups). Required radio groups are handled by `required` plus the fact that an unset radio group has no value.

**Alternatives considered:** Validating inside each component with local state was rejected because it spreads one rule set across many components and makes the "validate the whole step" operation impossible to express. HTML5 constraint validation alone was rejected because it produces inconsistent messages across browsers, cannot express rules like "select at least one checkbox", and offers no way to render the error summary the spec requires.

### 4. Validation timing: validate on submit of a step, revalidate on change

**Choice:** A step is validated when the user attempts to advance. After a field has failed, it is revalidated on every change, so an error disappears as soon as the value becomes valid. Fields that have not yet been touched are never shown as invalid.

**Why:** Validating on every keystroke from the first character is hostile — the user is told they are wrong while they are still typing their first character. Validating only on advance is forgiving but leaves a stale error visible after the user has already fixed the field. The combination gives an error exactly when the user has committed to a step and gives them immediate relief on correction.

### 5. Focus management: move focus to the first invalid field

**Choice:** When a step fails validation, the error summary is rendered and focus is moved to the first invalid control in document order. The summary's entries are buttons that move focus to their field.

**Why:** Announcing an error without moving focus leaves a screen reader user at the top of the page with no indication of what failed. Moving focus to the first invalid field is the pattern that makes the failure actionable. Using document order rather than the order errors were discovered keeps the behaviour predictable.

**Alternatives considered:** Focusing the error summary itself was rejected because the summary is a list, and the user then has to navigate it to reach the field. An alert region was rejected because it interrupts rather than guides.

### 6. State: a single reducer in a Context, with a derived step index

**Choice:** One `useReducer` holds the answers, the current step index, the validation state, and the submission state. A `FormProvider` exposes it. The step list, its rules, and its fields are static module constants, so the current step is derived from the index rather than stored.

**Why:** The form has one obvious source of truth, and a reducer makes state transitions explicit and reviewable — `ADVANCE`, `BACK`, `SET_VALUE`, `RESTORE_DRAFT`, `SUBMIT`. The validation result is stored alongside the answers so that "which fields are showing errors" is state rather than a second parallel structure that can drift.

**Alternatives considered:** Several `useState` calls in a provider were rejected because related updates (clear an error and record a new value together) would need to be coordinated by hand. A reducer is also directly testable without React.

### 7. Draft persistence: `localStorage`, one key, debounced writes

**Choice:** The draft is written to `localStorage` under a single constant key, containing the answers and the current step index. Writes are debounced so that typing does not cause a write per keystroke.

**Why:** `localStorage` is synchronous and small, but the draft is a few kilobytes and the browser's 5MB quota is not a concern at this size. The alternative in this repository, `sql.js` with IndexedDB as used by `voice-notes-app`, is warranted for a relational store with a real schema; for a single JSON blob it is ceremony, and it would mean shipping a WASM binary for a form draft. One key makes the draft deterministically removable, which the spec requires.

**Debouncing:** A 300ms debounce mirrors the search behaviour already specified for `voice-notes-app`, keeping the repository internally consistent. The draft is also flushed synchronously on unload so a final edit is never lost.

**Corruption handling:** A parse failure is treated as "no draft": the stored value is discarded and the form starts clean. A draft that cannot be read must not be able to block the form.

### 8. Accessibility: native elements, explicit association, `aria-describedby`

**Choice:** Every control is a native `input`, `textarea`, `select`, or a native radio/checkbox group. Labels use `htmlFor`, error messages use `id` referenced by `aria-describedby`, invalid controls get `aria-invalid`, groups use `fieldset`/`legend`, and the error summary is a `role="alert"` region.

**Why:** Native elements bring keyboard behaviour, focus, and screen reader semantics for free, which is exactly what a hand-rolled component would have to reimplement. Grouping radios and checkboxes in a `fieldset` with a `legend` is what makes a group announce its question rather than each option separately.

### 9. Visual direction: "studio ledger" — warm paper, ink, and a single brass accent

**Choice:** A light, paper-toned palette (`#F7F3EC` ground, `#1C1A17` ink, `#8A6A2F` brass accent), a serif display face for headings against a humanist sans for body text, and a grid that breaks asymmetrically — the form sits on a wide sheet with a persistent step rail beside it on desktop, and the rail collapses above the sheet on mobile.

**Why:** The repository's design standards ask for a committed direction, and a furniture joinery studio is a good fit for the tactile, letterpress register of paper, ink, and brass. It also reads as an *atelier* tool rather than a SaaS admin panel, and it is deliberately unlike the blue-and-grey Syncfusion aesthetic of the existing voice-notes app, so the repository's examples stay visually distinguishable from one another.

**Typography:** Headings use a transitional serif with character; body text uses a humanist sans chosen for long-form legibility. Both are loaded from a single self-hosted-free CDN request, with a system fallback stack so the app renders correctly without network access.

**Motion:** A short staggered reveal on step entry, and a 150ms transition on focus and error states. Motion is kept subordinate to the form's function — nothing animates long enough to delay the next action, and all of it is disabled under `prefers-reduced-motion`.

### 10. Testing: unit tests for the pure logic, plus a render test of the form

**Choice:** `vitest` with `jsdom` and `@testing-library/react`. The rule engine, the step validation, and the draft serialisation are tested as pure functions; the form is rendered in a test to assert that an invalid field blocks advancement and that an error is shown.

**Why:** The parts most likely to break and hardest to verify by eye are the validation rules and the draft round-trip, and both are pure functions, so they can be tested exactly. One render test is kept to prove the wiring between the rules and the UI — that is the seam a unit test alone would not cover. A full end-to-end suite is out of scope for a reference app with no backend.

### 11. Submission is simulated locally

**Choice:** Submission runs an asynchronous local routine that resolves with a generated reference number, after which the app shows the confirmation.

**Why:** The spec requires a confirmation with a reference identifier and requires that a failed submission preserves the user's answers. A simulated async submission exercises both paths — the success confirmation and the failure path — without a backend, and keeps the application entirely client-side. The reference number is generated from a timestamp so it is stable within a session and unique enough to demonstrate the flow.

**Alternatives considered:** Posting to a public echo endpoint was rejected because it introduces a network dependency, an external failure mode, and a third-party data path for what is a demonstration.

## Risks / Trade-offs

- **The schema approach does not scale to deeply conditional forms.** Rules are evaluated against a single value and cannot express "field B is required only when field A equals X". This is a deliberate boundary: conditional logic would require a different validation model and considerably more machinery. The app avoids the situation by designing fields that do not need it.
- **A hand-written validation layer will always trail the browser's built-in constraints.** The app deliberately uses `noValidate` on the form and its own messages so the presentation is consistent and the error summary can link to fields. The trade-off is that native constraint validation features (such as the browser's own UI) are not used, and the app owns that responsibility entirely.
- **The single reducer grows as the form gains features.** For a four-step form with a fixed field set this is comfortable. It would need splitting into a state library if the form gained dynamic field arrays or cross-step conditional visibility.
- **Simulated submission could be mistaken for real persistence.** The confirmation is explicit that the request was not transmitted. The risk is a reader assuming a backend exists; the app's own copy and the README state otherwise.
- **`localStorage` is unavailable in some privacy modes and is cleared with site data.** The application degrades to an in-memory form when storage access throws, which is a realistic condition for private browsing with strict settings. Drafts are convenience, not a guarantee, and the app never claims otherwise.
