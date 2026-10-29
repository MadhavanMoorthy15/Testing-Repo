# Proposal

## Why

This repository demonstrates a spec-driven workflow through reference applications, but it contains no example of a data-entry experience — the multi-step, partially-completed, rule-heavy kind of form that most real product work actually revolves around. Long forms fail quietly: users lose work on refresh, meet validation walls without explanation, and cannot tell what has already been answered. A carefully built form application exercises the interaction and validation patterns the other examples deliberately avoid, and gives the OpenSpec workflow a second live application to track.

## What Changes

- Add a new application, `atelier-form-app/`, implementing a multi-step "furniture commission request" form for a fictional joinery studio.
- Build the form as four ordered steps — Client, Project, Specifications, and Review — where each step owns a group of fields and validates independently before the user may advance.
- Add a reusable, schema-driven field layer (text, textarea, email, tel, url, number, select, radio group, checkbox group, and single consent checkbox) so every field renders from one declarative description and validates from the same rules.
- Add inline field-level validation with accessible error messaging, an error summary, and focus management that moves the user to the first invalid field.
- Add local draft persistence: form state is autosaved to `localStorage` as the user works, restored on return, and clearable on request.
- Add a review step that summarises every answer, allows jumping back to any step to correct it, and requires an explicit consent checkbox before submission.
- Add a submission confirmation state that issues a reference number for the completed commission.
- Add a focused test suite covering the validation rules and draft serialization, and document the app in the repository README.

## Capabilities

### New Capabilities

- `commission-form`: The step model, the schema-driven field rendering, step-to-step navigation, and the validation rules that gate progress through the commission request.
- `form-draft`: Autosaving, restoring, and clearing the in-progress form state so a partially completed request survives a reload or an accidental navigation away.
- `form-submission`: The review summary, the consent gate, the submission action, and the confirmation that closes the request.

### Modified Capabilities

<!-- None. This change introduces a new application and does not alter the requirements of any existing capability. -->

## Impact

- **New code**: `atelier-form-app/` — a Vite + React 19 + TypeScript application using CSS Modules and the Context API for state, consistent with the conventions of the existing `voice-notes-app` and the planned e-commerce application.
- **New dependencies**: `react`, `react-dom`, and dev tooling (`vite`, `typescript`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`). No UI component library and no runtime service dependencies.
- **New specs**: `openspec/specs/commission-form/`, `openspec/specs/form-draft/`, and `openspec/specs/form-submission/`.
- **Documentation**: the repository `README.md` gains an entry for the new reference application.
- **Systems**: none. The application is entirely client-side, uses `localStorage` for draft persistence, and has no backend, no authentication, and no network calls.
