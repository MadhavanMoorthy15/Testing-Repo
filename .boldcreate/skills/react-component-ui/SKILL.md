---
name: react-component-ui
description: Build React components in this repository with the design tokens, the CSS module pattern and the accessibility rules the apps follow. Use when the user asks for a component, a screen, a form, a button, or the look and feel of the interface.
license: MIT
---

# Build a component

Components in this repository live in `src/components/<area>/`, one file per component, with
a CSS module beside it. The design tokens live in `src/index.css`.

## A component

```tsx
import type { Note } from '../../types';
import { formatDateShort } from '../../utils/dateFormatter';
import styles from './home.module.css';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <article className={styles.noteCard}>
      <h3 className={styles.noteCard__title}>{note.title || 'Untitled'}</h3>
      <p className={styles.noteCard__body}>{note.content}</p>
      <time className={styles.noteCard__date} dateTime={note.created_at}>
        {formatDateShort(note.created_at)}
      </time>
    </article>
  );
}
```

## The tokens

The tokens live in `src/styles/variables.css`. Use the token, not a raw value. A raw colour
in a component breaks the dark theme.

| Token group | Tokens |
|---|---|
| Colour | `--color-primary`, `--color-primary-hover`, `--color-primary-dark`, `--color-primary-light`, `--color-background`, `--color-card`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-border`, `--color-error`, `--color-danger` |
| Font | `--font-family`, `--font-size-xs`, `--font-size-sm`, `--font-size-base`, `--font-size-lg`, `--font-size-xl`, `--font-size-title`, `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold` |
| Spacing | `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (12px), `--spacing-lg` (16px), `--spacing-xl` (24px), `--spacing-2xl` (32px), `--spacing-3xl` (48px) |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-full` |
| Shadow | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-modal` |
| Motion | `--transition-fast`, `--transition-base`, `--transition-smooth`, `--transition-slow` |
| Layout | `--sidebar-width`, `--bottom-nav-height`, `--top-bar-height`, `--editor-max-width` |

## The theme

The theme is a `data-theme` attribute on the root element. A theme override lives in the
token file, so a component never branches on the theme.

```css
[data-theme='dark'] {
  --color-background: #1A1A1A;
  --color-card: #2C2C2E;
  --color-text-primary: #F5F5F7;
}
```

## A CSS module

The apps name a class in the BEM style: the block is the component, the element is a part
of it, and the modifier is a state.

```css
.noteCard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
}

.noteCard__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.noteCard__title--muted {
  color: var(--color-text-muted);
}
```

The class name is the property path, so `styles.noteCard__title` is `.noteCard__title` in
the file. The class name uses `camelCase` for the block and `__` for the element.

```tsx
<div className={styles.noteCard}>
  <div className={`${styles.noteCard__title} ${muted ? styles.noteCard__title--muted : ''}`}>
    {note.title}
  </div>
</div>
```


## Accessibility

- A clickable element that is not a link is a `<button>`. Give it `type="button"` so it
  does not submit a form by accident.
- Every input has a `<label>` with `htmlFor` that matches the input's `id`.
- An icon-only button needs an `aria-label` that says what it does.
- An image that carries meaning needs an `alt`. A decorative image takes `alt=""`.
- The focus outline is never removed. Style it with `:focus-visible` instead.
- Colour alone never carries the meaning. A status also has a word or an icon.

## The forms

A field is a component, so every form in the app looks and behaves the same. The pattern
comes from `src/components/ui/FormGroup.tsx`.

```tsx
interface FormGroupProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
}

export default function FormGroup({
  label, name, type = 'text', value, onChange, error, placeholder,
}: FormGroupProps) {
  return (
    <div className={`${styles.formGroup} ${error ? styles.formGroupError : ''}`}>
      <label className={styles.formGroup__label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.formGroup__input}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className={styles.formGroup__errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

The validation helpers live in `src/utils/validation.ts` and return the message or `null`.

```ts
export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return null;
}
```


## Rules

- A component holds no data fetching. It takes the data as props.
- A component that only shows data does not need `useState`.
- Keep a component under about 150 lines. When it grows, split it.
- One component per file. The file is named after the component, in PascalCase.
- A reusable component takes its class names through props or a variant, not through a
  hard-coded colour.

## Related

- `spec-driven-feature` for the behaviour a component serves.
- `react-state-context` for the state a component reads.
