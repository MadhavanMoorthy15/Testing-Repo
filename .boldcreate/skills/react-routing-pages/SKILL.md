---
name: react-routing-pages
description: Add routes, pages and protected routes to a React app in this repository with React Router. Use when the user asks for a page, a route, navigation, a redirect, or guarding a screen behind a sign-in.
license: MIT
---

# Routing and pages

This repository uses React Router 7. Every route is declared in `src/App.tsx` and points at
a component in `src/pages/`.

## Declaring the routes

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

## A page

A page is a route component. It composes components and reads context. It holds no business
rules of its own.

```tsx
import { useItems } from '../contexts/ItemsContext';
import ItemCard from '../components/items/ItemCard';

export default function ItemsPage() {
  const { items } = useItems();

  return (
    <main className="page">
      <h1>Items</h1>
      <div className="grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
```

## A guarded route

A route that needs a signed-in user goes behind `ProtectedRoute`.

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }
  return <>{children}</>;
}
```

The loading check comes first. Without it the guard redirects a signed-in user to the
sign-in page while the session is still being read from storage.

## A parameter in the route

```tsx
<Route path="/items/:id" element={<ItemPage />} />
```

Read it with the hook, not with `useParams` alone, so the component re-renders when the
parameter changes.

```tsx
import { useParams } from 'react-router-dom';

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const item = useItem(Number(id));
  ...
}
```

## Rules

- One file per route in `src/pages/`. The file name is the page name in PascalCase.
- The route path is lowercase and hyphenated: `/auth/signin`, not `/Auth/SignIn`.
- A path that shows one record holds its identifier in the path: `/items/:id`.
- State that a user can share or that the back button must restore belongs in the search
  string, not in a component's state.
- The catch-all route redirects to the home page, so an unknown URL is never a blank screen.
- A route that needs a provider sits inside that provider in `src/App.tsx`.

## The link

Use the router's link, so the app does not reload the page.

```tsx
import { Link } from 'react-router-dom';

<Link to="/settings">Settings</Link>
```

## Testing a route

Use `MemoryRouter` with the initial path, so the test does not depend on the browser URL.

```tsx
render(
  <MemoryRouter initialEntries={['/items/42']}>
    <App />
  </MemoryRouter>,
);
```
