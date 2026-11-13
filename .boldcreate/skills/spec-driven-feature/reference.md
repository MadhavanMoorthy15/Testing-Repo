# The spec format of this repository

The specs live in `openspec/specs/<feature>/spec.md`. They use a BDD format: a requirement
that states a behaviour, and scenarios that give an example of it.

## The format

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

## The parts

| Part | What it is |
|---|---|
| `### Requirement: <name>` | One behaviour the app has |
| The line under it | The behaviour in one sentence, with `SHALL` |
| `#### Scenario: <name>` | One example of the requirement |
| `- **GIVEN**` | The state before the action |
| `- **WHEN**` | The action |
| `- **THEN**` | The result the user sees |

The requirement names a group of scenarios. Every scenario under it is a promise.

## The features that have a spec

| Feature | Folder |
|---|---|
| The application shell | `app-shell/` |
| The sign-up and sign-in flow | `auth-flow/` |
| The local database | `data-persistence/` |
| The home screen | `home-dashboard/` |
| The note editor | `note-editor/` |
| The recorder | `voice-recorder/` |
| The settings | `settings-management/` |
| The first-run flow | `onboarding/` |
| The AI text enhancement | `smart-write-ai/` |
| The e-commerce shell | `ecommerce-app-shell/` |
| The product catalog | `ecommerce-product-catalog/` |
| The shopping cart | `ecommerce-shopping-cart/` |
| The checkout | `ecommerce-checkout/` |
| The user account | `ecommerce-user-account/` |
| The orders | `ecommerce-order-management/` |

## How a scenario becomes a test

The scenario's wording becomes the test's name, and its three lines become the three parts
of the test.

```tsx
it('updates the quantity to 3 when the same product is added again', async () => {
  // GIVEN product A with quantity 2 is already in cart
  render(
    <MemoryRouter>
      <CartProvider initialItems={[{ productId: 'a', quantity: 2 }]}>
        <ProductCard product={productA} />
      </CartProvider>
    </MemoryRouter>,
  );

  // WHEN user adds product A with quantity 1
  await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

  // THEN product A quantity in cart updates to 3
  expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
});
```

A reader who knows the spec can read the test and know the behaviour is covered, without
looking anything up.

## What a good scenario says

- It names the visible result: the text that appears, the value that shows, the item that
  moves.
- It sets one state, does one action, and checks one result.
- It does not describe the implementation. "The repository updates the row" is not a
  scenario; "the badge shows 3" is.

## The change folder

A change in progress holds its own folder under `openspec/changes/<name>/`:

| File | What it holds |
|---|---|
| `proposal.md` | Why the change happens, what it changes, what it affects |
| `design.md` | How the change is built |
| `tasks.md` | The steps, in order |
| `.openspec.yaml` | The metadata of the change |

A finished change moves to `openspec/changes/archive/<date>-<name>/`.

## The relationship to the code

The spec is the contract. When the code and the spec disagree, the spec is right until
someone decides otherwise. Say so before changing either one.
