---
name: react-state-context
description: Add shared state to a React app in this repository with a Context provider, a custom hook and typed actions. Use when the user asks for state management, a context, a provider, sharing data between components, or storing state that outlives one component.
license: MIT
---

# Shared state with the Context API

This repository uses the Context API for shared state, one provider per concern. The pattern
comes from `voice-notes-app/src/contexts/`.

## The shape of a provider

A provider file holds three things: the context, its type, and the hook that reads it.

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagsContextType {
  tags: Tag[];
  addTag: (name: string, color: string) => void;
  removeTag: (id: number) => void;
}

// The default value keeps the type honest and stops a missing provider crashing.
const TagsContext = createContext<TagsContextType>({
  tags: [],
  addTag: () => {},
  removeTag: () => {},
});

export function useTags() {
  return useContext(TagsContext);
}

export function TagsProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([]);

  const addTag = useCallback((name: string, color: string) => {
    setTags((prev) => [...prev, { id: Date.now(), name, color }]);
  }, []);

  const removeTag = useCallback((id: number) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  return (
    <TagsContext.Provider value={{ tags, addTag, removeTag }}>
      {children}
    </TagsContext.Provider>
  );
}
```

## Rules

- One provider per concern. Do not put tags and settings in one provider.
- The provider owns the state and the actions that change it. A component that only reads
  state uses the hook, never `useState` for the same data.
- Wrap every action in `useCallback`. Without it the context value changes on every render
  and every consumer re-renders.
- Build the value object inside `useMemo` when the provider holds more than a few fields.
- The default context value must be complete, so a component rendered outside its provider
  fails quietly instead of throwing.

## Where the provider goes

Providers nest in `src/App.tsx`, outermost first. A provider that another provider reads
must sit above it.

```tsx
<DatabaseProvider>
  <AuthProvider>
    <TagsProvider>
      <Routes>...</Routes>
    </TagsProvider>
  </AuthProvider>
</DatabaseProvider>
```

## Loading state

A provider that reads from storage or a database holds a loading flag, because the first
render happens before the data arrives.

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  load().then(setTags).finally(() => setIsLoading(false));
}, []);
```

## Where the state belongs

| State | Where it goes |
|---|---|
| Used by one component | `useState` in that component |
| Used by a page and its children | `useState` in the page, passed down as props |
| Used by unrelated parts of the app | A provider |
| Mirrored in the URL | The router, through a search parameter |
| Stored between sessions | `localStorage`, written in the provider |

## Related

- `data-persistence-layer` for storing state in a database.
- `react-routing-pages` for state that belongs in the URL.
