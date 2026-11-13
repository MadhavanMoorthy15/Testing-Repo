---
name: spec-driven-feature
description: Build a feature in this repository the way the repository expects, from the OpenSpec requirement and its BDD scenarios through the code and the tests that prove each scenario. Use when the user asks to implement a feature, add behaviour, or work from a spec.
license: MIT
---

# Build a feature from a spec

This repository is spec-driven. A feature starts as a requirement with scenarios, and the
code and the tests follow the scenarios. The specs live in `openspec/specs/<feature>/spec.md`.

## Steps

1. **Read the spec.** Open `openspec/specs/<feature>/spec.md` and list every requirement and
   scenario in it. A scenario is a promise: "GIVEN the cart has 2 items, WHEN the user adds
   another, THEN the badge shows 3".

2. **Check what already exists.** The specs cover features that are not all built. The
   repository README lists what is implemented and what is only specified. Search the app
   folder before writing anything.

3. **Write the types.** The shared types go in `src/types/index.ts`. A field that comes from
   the database keeps the name the table gives it.

4. **Write the data access.** If the feature stores anything, add the table to
   `src/db/migrations.ts` and the queries to a repository in `src/db/repositories/`. Follow
   `data-persistence-layer`.

5. **Write the state.** Add a provider in `src/contexts/` when more than one part of the app
   needs the same data. Follow `react-state-context`.

6. **Write the route and the page.** Add the route to `src/App.tsx` and the page to
   `src/pages/`. Follow `react-routing-pages`.

7. **Write the components.** Put them in `src/components/<area>/`. One component per file, a
   CSS module beside it.

8. **Write the test for each scenario.** One test per scenario, named after the scenario.
   This is the step that proves the feature works.

9. **Run the checks.** `npm run build` and `npm test` inside the app folder.

## The spec format

```markdown
### Requirement: Add to cart functionality
The application SHALL allow users to add products to cart from product listing, product
detail page, and quick view modal.

#### Scenario: Add product to cart
- **WHEN** user clicks "Add to Cart" on a product
- **THEN** the product is added to cart with quantity 1 and a success toast displays
  "Product added to cart"

#### Scenario: Add duplicate product
- **GIVEN** product A with quantity 2 is already in cart
- **WHEN** user adds product A with quantity 1
- **THEN** product A quantity in cart updates to 3
```

The requirement line names the behaviour. The scenario lines are the test cases. The
`SHALL` in the requirement is the commitment.

## A test per scenario

The test carries the scenario's wording, so a reader can match a test to a scenario without
looking it up.

```tsx
describe('shopping cart', () => {
  it('adds the product with quantity 1 and shows a success toast', async () => {
    render(<MemoryRouter><CartProvider><ProductCard product={product} /></CartProvider></MemoryRouter>);

    await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    expect(screen.getByText('Product added to cart')).toBeInTheDocument();
  });

  it('updates the quantity to 3 when the same product is added again', async () => {
    // GIVEN product A with quantity 2 is already in cart
    render(<MemoryRouter><CartProvider initialItems={[{ productId: 'a', quantity: 2 }]}>
      <ProductCard product={productA} />
    </CartProvider></MemoryRouter>);

    // WHEN user adds product A with quantity 1
    await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    // THEN product A quantity in cart updates to 3
    expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
  });
});
```

## Rules

- Every scenario has a test. A scenario without a test is an unproven promise.
- A test states the given, the when and the then, so it reads like the scenario.
- Test through what the user sees: a role and a name, or a visible text. Do not assert on
  a component's internal state.
- Do not change a spec to match the code. If the code and the spec disagree, the spec is
  the contract; fix the code, or propose a spec change and say so.
- Keep a scenario's test next to the feature, not in one file at the end of the project.

## When the spec and the code disagree

Say so before changing anything. Then pick one of two paths:

- The spec is right. Change the code and make the test pass.
- The spec is wrong. Change the spec first, in its own commit, with the reason.

## Related

- `react-component-ui` for the components a feature is built from.
- `app-testing-vitest` for the test setup and the helpers.
