## ADDED Requirements

### Requirement: Cart page display
The application SHALL display a cart page at `/cart` showing all cart items with image, title, price, quantity selector, subtotal, and remove button. The page SHALL show cart summary with subtotal, tax, shipping, and total.

#### Scenario: Cart page with items
- **GIVEN** user has 2 items in cart
- **WHEN** user navigates to `/cart`
- **THEN** the page displays both items with their details and a cart summary

#### Scenario: Empty cart display
- **GIVEN** cart has no items
- **WHEN** user navigates to `/cart`
- **THEN** the page shows "Your cart is empty" message and "Continue Shopping" button

### Requirement: Add to cart functionality
The application SHALL allow users to add products to cart from product listing, product detail page, and quick view modal.

#### Scenario: Add product to cart
- **WHEN** user clicks "Add to Cart" on a product
- **THEN** the product is added to cart with quantity 1 and a success toast displays "Product added to cart"

#### Scenario: Add duplicate product
- **GIVEN** product A with quantity 2 is already in cart
- **WHEN** user adds product A with quantity 1
- **THEN** product A quantity in cart updates to 3

#### Scenario: Cart icon badge updates
- **GIVEN** cart has 2 items
- **WHEN** user adds another item
- **THEN** header cart badge updates to show "3"

### Requirement: Update cart quantity
The application SHALL allow users to increase or decrease item quantity using +/- buttons or direct input in the quantity field.

#### Scenario: Increase quantity
- **GIVEN** cart item has quantity 1
- **WHEN** user clicks + button
- **THEN** quantity updates to 2 and subtotal recalculates

#### Scenario: Decrease quantity
- **GIVEN** cart item has quantity 2
- **WHEN** user clicks - button
- **THEN** quantity updates to 1 and subtotal recalculates

#### Scenario: Decrease quantity to zero
- **GIVEN** cart item has quantity 1
- **WHEN** user clicks - button
- **THEN** item is removed from cart with confirmation

#### Scenario: Direct quantity input
- **WHEN** user types "5" in quantity field
- **THEN** quantity updates to 5 and subtotal recalculates

#### Scenario: Invalid quantity input
- **WHEN** user types "0" or negative number in quantity field
- **THEN** quantity reverts to minimum value of 1

### Requirement: Remove from cart
The application SHALL allow users to remove items from cart with a confirmation prompt.

#### Scenario: Remove item
- **WHEN** user clicks remove button on cart item
- **THEN** a confirmation dialog appears asking "Remove this item from cart?"

#### Scenario: Confirm removal
- **GIVEN** user clicked remove and sees confirmation dialog
- **WHEN** user clicks "Yes, Remove"
- **THEN** item is removed from cart and toast shows "Item removed from cart"

#### Scenario: Cancel removal
- **GIVEN** user clicked remove and sees confirmation dialog
- **WHEN** user clicks "Cancel"
- **THEN** dialog closes and item remains in cart

### Requirement: Cart summary calculation
The application SHALL automatically calculate and display subtotal (sum of all item prices × quantities), estimated tax (8% of subtotal), shipping cost (free over $50, otherwise $5.99), and total.

#### Scenario: Cart total calculation
- **GIVEN** cart has items totaling $45.00
- **WHEN** cart summary renders
- **THEN** it shows Subtotal: $45.00, Tax: $3.60, Shipping: $5.99, Total: $54.59

#### Scenario: Free shipping threshold
- **GIVEN** cart has items totaling $60.00
- **WHEN** cart summary renders
- **THEN** it shows Subtotal: $60.00, Tax: $4.80, Shipping: $0.00 (Free!), Total: $64.80

### Requirement: Cart persistence
The application SHALL persist cart data to localStorage so cart contents survive page refreshes and browser sessions.

#### Scenario: Cart persists on refresh
- **GIVEN** user has 3 items in cart
- **WHEN** user refreshes the page
- **THEN** cart still contains all 3 items with correct quantities

#### Scenario: Cart persists across sessions
- **GIVEN** user adds items to cart and closes browser
- **WHEN** user reopens browser and visits the site
- **THEN** cart still contains the previously added items

### Requirement: Continue shopping
The application SHALL provide a "Continue Shopping" button that returns user to the products page or previous product category.

#### Scenario: Continue shopping from cart
- **WHEN** user clicks "Continue Shopping" button on cart page
- **THEN** user is navigated to `/products`

### Requirement: Proceed to checkout
The application SHALL provide a "Proceed to Checkout" button that navigates authenticated users to checkout or unauthenticated users to sign-in.

#### Scenario: Checkout as authenticated user
- **GIVEN** user is logged in and has items in cart
- **WHEN** user clicks "Proceed to Checkout"
- **THEN** user is navigated to `/checkout`

#### Scenario: Checkout prompt for guest
- **GIVEN** user is not logged in
- **WHEN** user clicks "Proceed to Checkout"
- **THEN** user is redirected to `/auth/signin?redirect=/checkout`

### Requirement: Cart mini-view
The application SHALL display a cart mini-view dropdown when user hovers over or clicks cart icon in header, showing quick summary of cart items.

#### Scenario: Cart mini-view display
- **WHEN** user clicks cart icon in header
- **THEN** dropdown shows up to 3 cart items with image, title, price, and quantity, plus "View Cart" and "Checkout" buttons

#### Scenario: Quick remove from mini-view
- **WHEN** user clicks remove icon in cart mini-view
- **THEN** item is removed from cart and mini-view updates

### Requirement: Stock validation
The application SHALL validate product availability and stock levels when adding to cart.

#### Scenario: Add product exceeding stock
- **GIVEN** product has 5 units in stock and user already has 3 in cart
- **WHEN** user tries to add 3 more units
- **THEN** error toast shows "Only 5 units available. Cart quantity adjusted to 5"

#### Scenario: Out of stock prevention
- **GIVEN** product is out of stock
- **WHEN** user tries to add it to cart
- **THEN** error toast shows "This product is currently out of stock"
