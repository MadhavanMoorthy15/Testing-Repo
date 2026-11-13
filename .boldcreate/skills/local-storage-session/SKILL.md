---
name: local-storage-session
description: Store small pieces of state between sessions in a React app in this repository with localStorage, and keep the session and the theme. Use when the user asks for persistence of a preference, a session, a theme, or a saved setting.
license: MIT
---

# Store state between sessions

`localStorage` holds the small pieces of state: the signed-in user, the theme, the font
size, the last opened screen. The pattern comes from
`voice-notes-app/src/contexts/AuthContext.tsx` and `SettingsContext.tsx`.

## Read the value on the first render

A provider that reads storage in a `useEffect` shows an empty state for one frame. Read it
in the initialiser instead, so the first render already holds the saved value.

```tsx
const [theme, setThemeState] = useState<Settings['theme']>(
  () => (localStorage.getItem('SyncNotess_theme') as Settings['theme']) || 'light',
);
```

## Write the value when it changes

```tsx
const setTheme = useCallback((newTheme: Settings['theme']) => {
  setThemeState(newTheme);
  localStorage.setItem('SyncNotess_theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
}, []);
```

The key follows one rule: it starts with the app's prefix, so two apps on the same origin
do not read each other's values. `SyncNotess_theme`, `calculator-theme`.

## The session

The session holds the id of the signed-in user, not the user itself. The user is read from
the database on start, so a change to the user record is picked up.

```tsx
useEffect(() => {
  const savedUserId = localStorage.getItem('SyncNotess_user_id');
  if (savedUserId && db) {
    const foundUser = userRepo.findById(db, parseInt(savedUserId, 10));
    if (foundUser) setUser(foundUser);
  }
  setIsLoading(false);
}, [db]);
```

On sign out, remove the key:

```tsx
const logout = useCallback(() => {
  setUser(null);
  localStorage.removeItem('SyncNotess_user_id');
}, []);
```

## Rules

- The key starts with the app prefix.
- A value that can grow large belongs in the database, not in `localStorage`. It holds at
  most about 5 MB, as one string.
- A value that is not JSON is stored as a plain string. A value that is an object is stored
  with `JSON.stringify` and read with `JSON.parse`.
- Reading a value that may not be there must not throw. The `||` default handles a missing
  key; wrap `JSON.parse` in a try when the value could be corrupt.
- Clear the key on sign out, so the next person does not inherit the session.
- Never store a password, a token that grants access to a server, or a secret.

## A test

A test that writes to `localStorage` clears it first, so the order of the tests does not
matter.

```tsx
beforeEach(() => {
  localStorage.clear();
});

afterEach(cleanup);
```

## When to use the database instead

| State | Where it goes |
|---|---|
| The signed-in user id | `localStorage` |
| The theme and the font size | `localStorage` |
| The last opened screen | `localStorage` |
| Notes, orders, products | The database |

## Related

- `data-persistence-layer` for the database.
- `react-state-context` for the provider that owns these values.
