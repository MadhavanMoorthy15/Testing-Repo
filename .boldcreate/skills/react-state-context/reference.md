# The state layer of this repository

The apps keep their shared state in Context providers, one file per concern, in
`src/contexts/`.

## The files

| File | What it holds |
|---|---|
| `DatabaseContext.tsx` | The SQLite connection, and whether it is still loading |
| `AuthContext.tsx` | The signed-in user, and the actions that change it |
| `SettingsContext.tsx` | The theme and the font size |
| `NotesContext.tsx` | The notes, and the actions that change them |

## The order in `App.tsx`

```tsx
<DatabaseProvider>
  <AuthProvider>
    <SettingsProvider>
      <NotesProvider>
        <ToastProvider>
          <Routes>...</Routes>
        </ToastProvider>
      </NotesProvider>
    </SettingsProvider>
  </AuthProvider>
</DatabaseProvider>
```

The order is a dependency order. A provider reads the providers above it, so the database
comes first and the toast comes last, because it holds nothing but its own state.

## The shape of every provider

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (title: string, content: string) => void;
  deleteNote: (id: number) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  isLoading: true,
  addNote: () => {},
  deleteNote: () => {},
});

export function useNotes() {
  return useContext(NotesContext);
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { db } = useDatabase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    setNotes(noteRepo.getAll(db));
    setIsLoading(false);
  }, [db]);

  const addNote = useCallback((title: string, content: string) => {
    if (!db) return;
    noteRepo.create(db, title, content);
    setNotes(noteRepo.getAll(db));
  }, [db]);

  return (
    <NotesContext.Provider value={{ notes, isLoading, addNote, deleteNote: () => {} }}>
      {children}
    </NotesContext.Provider>
  );
}
```

## The rules

1. **One concern per provider.** Notes and settings are two providers, not one.
2. **The hook is the only way in.** A component reads `useNotes()`, never the context
   itself.
3. **The default value is complete.** A component rendered outside its provider fails
   quietly instead of throwing.
4. **Every action is a `useCallback`.** Without it the value object changes on every
   render, and every consumer re-renders.
5. **The provider owns the loading flag.** The first render happens before the data
   arrives, so the flag starts as `true`.
6. **The provider re-reads after a write.** A write goes to the database, and the state is
   read back, so the state and the database never drift apart.

## The value object

With more than a few fields, wrap the value in `useMemo`:

```tsx
const value = useMemo(() => ({ notes, isLoading, addNote, deleteNote }), [notes, isLoading, addNote, deleteNote]);
```

## When the state is not shared

| State | Where it goes |
|---|---|
| One component | `useState` in that component |
| One page and its children | `useState` in the page, passed as props |
| Unrelated parts of the app | A provider |
| In the URL | A search parameter, read with `useSearchParams` |
| Between sessions | `localStorage`, written in the provider |

## The toast provider

The toast provider is the smallest one. It shows a message and removes it after three
seconds.

```tsx
const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
  const id = ++toastId;
  setToasts((prev) => [...prev, { id, message, type }]);
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3000);
}, []);
```

The id is a counter outside the component, so two toasts never share one.
