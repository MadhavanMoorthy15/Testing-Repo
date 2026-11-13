---
name: app-testing-vitest
description: Test a React app in this repository with Vitest and Testing Library, using the roles and labels a user sees. Use when the user asks for tests, test coverage, a failing test, or when a test fails and needs fixing.
license: MIT
---

# Test the app

This repository uses Vitest with Testing Library and a jsdom environment. The pattern comes
from `calculator/src/Calculator.test.tsx`.

## The setup

The app folder holds the Vitest config:

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
```

```ts
// src/test-setup.ts
import '@testing-library/jest-dom/vitest';
```

## A test

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Calculator from './Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(cleanup);

  it('calculates expressions and adds them to the history tab', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getByLabelText('Calculator display')).toHaveValue('10');
  });
});
```

## Finding the element

Reach for the element the way a user finds it. This is what makes the test fail when the
interface breaks, instead of passing when the markup changes.

| Query | Use it for |
|---|---|
| `getByRole('button', { name: 'Save' })` | A button, a link, a checkbox |
| `getByLabelText('Email')` | An input that has a label |
| `getByText('Product added to cart')` | Text a user reads |
| `getByPlaceholderText('Search')` | A search field, as a last resort |
| `getByTestId('cart-total')` | A value with no text, such as a number |

`getBy` fails when the element is missing, which is what a test wants. `queryBy` returns
`null` instead, which is for checking that something is absent.

## Rules

- Assert on what the user sees: a role, a label, a visible text, a value. Do not assert on
  a component's state or on a class name.
- `getByRole` finds a button by its accessible name, so a button with only an icon needs an
  `aria-label`.
- Give an input a `label` with `htmlFor`. It is what `getByLabelText` needs.
- `fireEvent` for a simple interaction, `userEvent` when the interaction has a sequence
  (typing, clicking, then checking).
- Clean up between tests when a test writes to `localStorage` or to the database.
- The test name says what the app does, not which method it calls.

## A test with a provider

```tsx
render(
  <MemoryRouter>
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>
  </MemoryRouter>,
);
```

`MemoryRouter` sets the URL for the test without touching the browser history.

## A test for a scenario

A scenario in the spec becomes a test with the same wording.

```tsx
it('updates the quantity to 3 when the same product is added again', async () => {
  render(
    <MemoryRouter>
      <CartProvider initialItems={[{ productId: 'a', quantity: 2 }]}>
        <ProductCard product={productA} />
      </CartProvider>
    </MemoryRouter>,
  );

  await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

  expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
});
```

## Running the tests

```bash
npm test              # run every test
npm test -- --watch   # run again on every change
npm test -- src/App.test.tsx   # run one file
```

## When a test fails

1. Read the failure. It names the element that was not found, or the value that did not
   match.
2. Decide whether the code or the test is wrong.
3. Fix the test only when the query is wrong, for example when the element has no accessible
   name. Fixing the query means giving the element a name, not reaching for a test id.
4. Fix the code when the behaviour is wrong.

Never weaken an assertion to make it pass. A test that asserts nothing is worse than no
test, because it reports success.
