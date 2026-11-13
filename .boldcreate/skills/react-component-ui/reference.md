# The design tokens of this repository

The tokens live in `src/styles/variables.css` in each app. A component uses the token, so
the theme can change the value without touching the component.

## Colour

| Token | Light | Use |
|---|---|---|
| `--color-primary` | `#2D5BFF` | The main action |
| `--color-primary-hover` | `#2348E6` | The main action under the pointer |
| `--color-primary-dark` | `#1E40D8` | The pressed main action |
| `--color-primary-light` | `#EEF2FF` | A soft background for a primary action |
| `--color-background` | `#F5F5F7` | The page |
| `--color-card` | `#FFFFFF` | A card or a panel |
| `--color-text-primary` | `#1A1A1A` | Body text |
| `--color-text-secondary` | `#666666` | Supporting text |
| `--color-text-muted` | `#999999` | A placeholder or a disabled label |
| `--color-border` | `#E5E5E7` | A divider |
| `--color-border-focus` | `#2D5BFF` | The border of a focused field |
| `--color-error` | `#DC2626` | An error message |
| `--color-danger` | `#EF4444` | A destructive action |

## Font

| Token | Value |
|---|---|
| `--font-family` | The system stack, starting with `-apple-system` |
| `--font-size-xs` | `12px` |
| `--font-size-sm` | `14px` |
| `--font-size-base` | `16px` |
| `--font-size-md` | `16px` |
| `--font-size-lg` | `18px` |
| `--font-size-xl` | `20px` |
| `--font-size-title` | `24px` |
| `--font-size-splash` | `48px` |
| `--font-weight-regular` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold` | `700` |

## Spacing

| Token | Value |
|---|---|
| `--spacing-xs` | `4px` |
| `--spacing-sm` | `8px` |
| `--spacing-md` | `12px` |
| `--spacing-lg` | `16px` |
| `--spacing-xl` | `24px` |
| `--spacing-2xl` | `32px` |
| `--spacing-3xl` | `48px` |

## Radius

| Token | Value |
|---|---|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `20px` |
| `--radius-2xl` | `24px` |
| `--radius-full` | `9999px` |

## Shadow

| Token | Use |
|---|---|
| `--shadow-sm` | A card at rest |
| `--shadow-md` | A card under the pointer |
| `--shadow-lg` | A raised panel |
| `--shadow-xl` | A modal |
| `--shadow-modal` | A sheet that comes from the bottom |

## Motion

| Token | Value |
|---|---|
| `--transition-fast` | `150ms ease-in-out` |
| `--transition-base` | `250ms ease-in-out` |
| `--transition-smooth` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-slow` | `500ms ease-in-out` |

## Layout

| Token | Use |
|---|---|
| `--sidebar-width` | The width of the sidebar |
| `--sidebar-collapsed-width` | The width of a collapsed sidebar |
| `--bottom-nav-height` | The height of the bottom navigation |
| `--top-bar-height` | The height of the header |
| `--editor-max-width` | The width of the text in an editor |
| `--settings-max-width` | The width of a settings column |

## The dark theme

The theme is a `data-theme` attribute on the root element, set by the settings provider.

```tsx
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

The dark theme redefines the colour tokens and nothing else. A component never branches on
the theme, because a token that changes is enough.

```css
[data-theme='dark'] {
  --color-background: #1A1A1A;
  --color-card: #2C2C2E;
  --color-text-primary: #F5F5F7;
  --color-text-secondary: #A1A1A6;
  --color-border: #38383A;
}
```

## A rule for a new token

Add a token when the same value appears in three places. Before that, use the token that is
already there.
