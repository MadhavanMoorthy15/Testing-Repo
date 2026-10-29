# Atelier — Commission Request Form

A multi-step form application for a fictional joinery studio. It collects a
furniture commission request across four steps and demonstrates the parts of
form work that are easy to get wrong: validation that explains itself, focus
that goes where the user needs it, and drafts that survive an interruption.

**Stack:** React 19 · TypeScript · Vite 8 · CSS Modules · Vitest

No backend, no UI component library, no runtime dependencies beyond React.

---

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Typecheck and build for production |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm test` | Run the test suite once |

---

## How it is built

### One definition drives everything

Every question is declared once, in `src/lib/formSchema.ts`:

```ts
{
  name: 'email',
  kind: 'email',
  label: 'Email address',
  hint: 'Drawings and the quotation arrive here.',
  rules: [
    { type: 'required', message: 'Enter an email address so we can reach you.' },
    { type: 'email', message: 'Enter a valid email address, such as you@example.com.' },
  ],
}
```

That single entry gives you the control that renders, the rules that validate
it, the row it occupies in the review summary, and the entry in the saved
draft. Adding a field means adding one entry.

The steps are ordered `Client → Project → Specifications → Review`.

### Validation is a pure function

`validateField(value, rules)` in `src/lib/validation.ts` returns a list of
messages. It has no knowledge of React, so it can be tested exactly, and the
same function serves three call sites: validating a step on "Continue",
validating every step before submission, and revalidating a field as it is
corrected.

Supported rules: `required`, `minLength`, `maxLength`, `email`, `url`, `min`,
`max`, and `minSelected` (for checkbox groups).

### Errors are explained, not just flagged

- Each failure is shown next to the field it belongs to, with the control
  marked `aria-invalid` and the message wired through `aria-describedby`.
- When a step cannot be advanced, a summary appears above the fields listing
  every problem on that step. Each entry is a button that moves focus to the
  field it refers to.
- Focus then moves to the first invalid field, so the failure is actionable
  rather than merely reported.
- A field that has failed is revalidated on every change, so the error
  disappears the moment the value becomes valid.

### Drafts survive an interruption

Answers and the current step are written to `localStorage` under a single
key, debounced at 300ms and flushed on page unload. On returning, the user is
offered the saved draft rather than having it silently applied or discarded.

A draft that cannot be parsed is discarded and the form starts clean — a
corrupt draft can never block the form. When storage is unavailable (some
privacy modes), the form keeps working in memory.

### Accessibility

- Native `input`, `textarea`, `select`, and radio/checkbox groups, so
  keyboard behaviour and screen reader semantics come for free.
- Radio and checkbox groups are wrapped in `fieldset`/`legend`, so the group
  is announced with its question.
- Every interactive element has a visible focus ring and a 44×44px minimum
  touch target.
- Errors are marked with an icon and text, never by colour alone.
- A skip link jumps past the masthead to the form.
- All motion is disabled under `prefers-reduced-motion`.

### Visual direction

The design is "studio ledger": warm paper, ink, and a single brass accent.
Headings are set in a transitional serif, body text in a humanist sans. On
desktop the progress rail sits beside the form sheet; on mobile it collapses
above it. All colour, spacing, and motion values come from
`src/styles/tokens.css`.

---

## Project layout

```
src/
  components/
    fields/          FieldShell, the individual controls, and FieldRenderer
    ErrorSummary     The list of problems on the current step
    ProgressBar      Completion indicator
    ReviewSummary    Every answer, grouped by step
    StepActions      Back and Continue
    StepRail         The progress rail
  context/
    FormContext      Provider, actions, and draft autosave
    formReducer      The reducer holding form state
  lib/
    draft            localStorage persistence
    formSchema       The form definition
    submission       The local submission routine
    validation       The rule engine
  pages/
    CommissionFormPage  The form itself
    ConfirmationPage    The submitted state
  styles/
    global.css       Resets and base typography
    tokens.css       Design tokens
```

---

## Tests

```bash
npm test
```

59 tests across three files:

- `src/test/validation.test.ts` — every rule and its boundaries, including the
  rule that an empty optional field is not an error.
- `src/test/draft.test.ts` — save, load, clear, corrupt data, and
  unavailable storage.
- `src/test/form.test.tsx` — the form as a user meets it: an empty required
  field blocks advancing, an error clears on correction, an invalid email is
  rejected, the review step summarises the answers, consent is required, a
  successful submission shows a reference, and a draft is restored.

---

## Notes

Submission is simulated locally: there is no server, and the request is not
transmitted anywhere. The confirmation says so too.
