---
name: responsive-app-shell
description: Build the responsive layout of an app in this repository, with the header, the sidebar, the bottom navigation and the content area. Use when the user asks for the app shell, the layout, the navigation, a sidebar, or a responsive design.
license: MIT
---

# The app shell

The shell is the frame around every screen: the header, the sidebar, the bottom navigation
and the content area. The pattern comes from `voice-notes-app/src/components/home/` and the
layout tokens in `src/styles/variables.css`.

## The layout

```
┌──────────────────────────────┐
│  Header (search, actions)    │
├──────────┬───────────────────┤
│ Sidebar  │  Content          │
│ (wide)   │                   │
├──────────┴───────────────────┤
│  Bottom navigation (narrow)  │
└──────────────────────────────┘
```

The sidebar shows on a wide screen, the bottom navigation shows on a narrow one. Both are
always in the markup; the CSS decides which is visible.

## The CSS

```css
.appLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar {
  display: none;          /* hidden until the wide layout */
}

.mainContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--bottom-nav-height);
  position: relative;
  max-width: 100%;
}

.bottomNav {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background-color: var(--color-card);
  border-top: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .appLayout {
    flex-direction: row;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width);
    border-right: 1px solid var(--color-border);
  }

  .bottomNav {
    display: none;
  }
}
```

The mobile layout comes first, and the wide layout is the override. This is the "mobile
first" rule: the base styles serve the small screen and the media query adds to them.

## The tokens that hold the layout

| Token | Value |
|---|---|
| `--sidebar-width` | The width of the sidebar |
| `--sidebar-collapsed-width` | The width of a collapsed sidebar |
| `--bottom-nav-height` | The height of the bottom navigation |
| `--top-bar-height` | The height of the header |
| `--editor-max-width` | The width of a text editor column |
| `--settings-max-width` | The width of a settings column |

The content area reserves the space of the fixed bottom navigation with
`padding-bottom: var(--bottom-nav-height)`, so the last row of content is not hidden
behind it.

## The navigation item

```tsx
import { NavLink } from 'react-router-dom';
import styles from './home.module.css';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export default function NavItem({ to, label, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItem--active : ''}`
      }
    >
      <span className={styles.navItem__icon}>{icon}</span>
      <span className={styles.navItem__label}>{label}</span>
    </NavLink>
  );
}
```

`NavLink` marks the active route, so the shell does not track the location itself. The
active state is a class, not a colour alone: the label also changes weight.

## Rules

- Write the mobile layout first, then the media query.
- Use the layout tokens for every fixed size. A hard-coded `64px` breaks the theme.
- A fixed element reserves its space in the flow, or it covers the content.
- The header is sticky, so it holds a `z-index` above the content.
- A navigation item states the active route through a class, not only through a colour.
- The shell holds no business state. It reads the auth and the settings contexts.

## The screen sizes

| Width | Layout |
|---|---|
| Below 768px | One column, the bottom navigation, no sidebar |
| 768px and above | The sidebar, no bottom navigation |
| 1200px and above | A wider content column, centred with a maximum width |
