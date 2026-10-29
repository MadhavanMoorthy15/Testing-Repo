# Tasks

## 1. Project Setup & Scaffolding

- [x] 1.1 Create `atelier-form-app/` with a Vite + React 19 + TypeScript configuration (`package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `.gitignore`)
- [x] 1.2 Install runtime dependencies (`react`, `react-dom`) and dev dependencies (`vite`, `typescript`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`)
- [x] 1.3 Create the source folder structure: `src/components/`, `src/components/fields/`, `src/context/`, `src/hooks/`, `src/lib/`, `src/pages/`, `src/styles/`, `src/types/`
- [x] 1.4 Create `src/styles/tokens.css` with all design tokens (colour, typography, spacing, radii, shadows, motion) and `src/styles/global.css` with resets, base typography, and reduced-motion handling
- [x] 1.5 Configure the Vitest test environment (`jsdom`), setup file, and npm scripts for `dev`, `build`, `preview`, `test`, and `typecheck`

## 2. Types & Schema Definition

- [x] 2.1 Create `src/types/form.ts` with `FieldKind`, `Rule`, `FieldDefinition`, `StepDefinition`, `FormValues`, and `ValidationErrors` types
- [x] 2.2 Define the rule union covering `required`, `minLength`, `maxLength`, `email`, `url`, `min`, `max`, and `minSelected`
- [x] 2.3 Define the four steps — Client, Project, Specifications, Review — as typed constants in `src/lib/formSchema.ts`
- [x] 2.4 Populate the Client step fields: full name, email, phone, preferred contact method
- [x] 2.5 Populate the Project step fields: project type, room, budget band, target completion date, project brief
- [x] 2.6 Populate the Specifications step fields: timber species, finish, dimensions, quantity, engineered or solid preference, bespoke features checkbox group
- [x] 2.7 Populate the Review step fields: review consent checkbox

## 3. Validation Engine

- [x] 3.1 Implement `validateField(value, rules)` in `src/lib/validation.ts` as a pure function returning an array of error messages
- [x] 3.2 Implement each rule: required, minLength, maxLength, email, url, min, max, minSelected — with human-readable messages
- [x] 3.3 Implement `validateStep(fields, values)` returning errors keyed by field name, skipping fields with no applicable rules
- [x] 3.4 Implement `validateAllSteps(steps, values)` for pre-submission validation of every step
- [x] 3.5 Ensure optional fields that are empty produce no errors, while optional fields with an invalid non-empty value do

## 4. Draft Persistence

- [x] 4.1 Implement `src/lib/draft.ts` with the draft storage key, `saveDraft`, `loadDraft`, and `clearDraft`
- [x] 4.2 Serialize only the answers and the current step index into the draft payload
- [x] 4.3 Handle a missing, malformed, or unparsable stored draft by returning `null` and removing the corrupt entry
- [x] 4.4 Handle `localStorage` being unavailable (private mode / disabled storage) by degrading to in-memory behaviour without throwing
- [x] 4.5 Implement `useDraftAutosave` hook that debounces writes at 300ms and flushes pending writes on page unload

## 5. State Management

- [x] 5.1 Implement `src/context/formReducer.ts` with actions `SET_VALUE`, `ADVANCE`, `BACK`, `GO_TO_STEP`, `SET_ERRORS`, `RESTORE_DRAFT`, `CLEAR_DRAFT`, `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_FAILURE`, and `RESET`
- [x] 5.2 Implement the reducer so advancing requires the current step to be valid, and record the validation errors for the step
- [x] 5.3 Implement `src/context/FormContext.tsx` exposing the form state, the derived current step, and the action helpers
- [x] 5.4 Implement the submission routine in `src/lib/submission.ts` that resolves with a generated reference number and can simulate failure
- [x] 5.5 Ensure a failed submission leaves the answers intact and clears only the submitting flag

## 6. Field Rendering Components

- [x] 6.1 Create `src/components/fields/FieldShell.tsx` providing the label, control slot, hint text, and error message association
- [x] 6.2 Create `src/components/fields/TextField.tsx` rendering text, email, tel, url, and number inputs with `aria-invalid` and `aria-describedby`
- [x] 6.3 Create `src/components/fields/TextAreaField.tsx` with a character counter for fields with a maximum length
- [x] 6.4 Create `src/components/fields/SelectField.tsx` rendering an option list including a placeholder option
- [x] 6.5 Create `src/components/fields/RadioGroupField.tsx` using `fieldset`/`legend` for grouping
- [x] 6.6 Create `src/components/fields/CheckboxGroupField.tsx` using `fieldset`/`legend` and supporting a minimum selection count
- [x] 6.7 Create `src/components/fields/FieldRenderer.tsx` dispatching on the field's kind to the matching control

## 7. Form Step & Navigation Components

- [x] 7.1 Create `src/components/StepRail.tsx` showing the four steps, marking the current step and completed steps, with the step number and name
- [x] 7.2 Create `src/components/ErrorSummary.tsx` rendering a `role="alert"` region listing the current step's errors with buttons that focus the associated field
- [x] 7.3 Create `src/components/ReviewSummary.tsx` grouping answers by step, showing "not provided" for empty optional fields, and allowing navigation back to any step
- [x] 7.4 Create `src/components/ProgressBar.tsx` showing overall completion as a percentage
- [x] 7.5 Create `src/components/StepActions.tsx` rendering the Back and Continue buttons, disabling Back on the first step

## 8. Pages & Application Shell

- [x] 8.1 Create `src/pages/CommissionFormPage.tsx` composing the step rail, the current step's fields, the error summary, and the step actions
- [x] 8.2 Implement step rendering with a staggered entrance animation that respects `prefers-reduced-motion`
- [x] 8.3 Implement focus management: move focus to the first invalid field after a failed advance, and move focus to the step heading on a successful step change
- [x] 8.4 Create `src/pages/ConfirmationPage.tsx` showing the reference number, the submitted summary, and a "start a new request" action
- [x] 8.5 Create `src/App.tsx` and `src/main.tsx` with the provider tree and global style imports
- [x] 8.6 Implement the draft-restore prompt offering to continue from a saved draft or start fresh

## 9. Styling & Accessibility

- [x] 9.1 Implement the "studio ledger" visual direction: paper-toned ground, ink text, brass accent, serif display headings, and humanist sans body text
- [x] 9.2 Implement the asymmetric desktop layout with the step rail beside the form sheet, collapsing to a single column on mobile
- [x] 9.3 Style every control with visible focus indicators meeting the 44×44px minimum touch target
- [x] 9.4 Style the error summary and invalid field states with non-colour-only indicators
- [x] 9.5 Verify the form uses semantic elements (`main`, `section`, `form`, `nav`, `fieldset`) and that all interactive elements are keyboard reachable
- [x] 9.6 Add a skip link and ensure focus is visible against both the sheet and the rail

## 10. Tests

- [x] 10.1 Write unit tests for `validateField` covering every rule and its boundary conditions
- [x] 10.2 Write unit tests for `validateStep` covering multi-error steps and optional empty fields
- [x] 10.3 Write unit tests for the draft module covering save, load, clear, corrupt data, and unavailable storage
- [x] 10.4 Write a render test asserting that an empty required field blocks advancement and renders an error
- [x] 10.5 Write a render test asserting that a valid step advances and that the review step summarises the answers

## 11. Documentation

- [x] 11.1 Create `atelier-form-app/README.md` documenting the app, the schema, the scripts, and the accessibility approach
- [x] 11.2 Add the new application to the repository root `README.md` reference application list
- [x] 11.3 Sync the delta specs into `openspec/specs/` for `commission-form`, `form-draft`, and `form-submission`
- [x] 11.4 Run `openspec validate --strict`, `npm run typecheck`, `npm test`, and `npm run build` and confirm all pass
