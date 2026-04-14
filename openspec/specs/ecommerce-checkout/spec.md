## ADDED Requirements

### Requirement: Multi-step checkout process
The application SHALL implement a multi-step checkout flow with steps: 1) Shipping Address, 2) Payment Method, 3) Review & Place Order. Progress indicator SHALL show current step.

#### Scenario: Checkout progress display
- **WHEN** user is on shipping address step
- **THEN** progress indicator shows step 1 of 3 as active

#### Scenario: Navigate between steps
- **WHEN** user completes shipping address and clicks "Continue"
- **THEN** user proceeds to payment method step (step 2)

#### Scenario: Back navigation
- **GIVEN** user is on payment method step
- **WHEN** user clicks "Back" button
- **THEN** user returns to shipping address step with previously entered data preserved

### Requirement: Shipping address form
The application SHALL display a shipping address form with fields: Full Name, Email, Phone, Address Line 1, Address Line 2 (optional), City, State/Province, ZIP/Postal Code, Country. All fields except Address Line 2 SHALL be required.

#### Scenario: Valid shipping form submission
- **GIVEN** user fills all required shipping fields correctly
- **WHEN** user clicks "Continue to Payment"
- **THEN** form validates successfully and user proceeds to payment step

#### Scenario: Invalid shipping form
- **GIVEN** user leaves ZIP code field empty
- **WHEN** user clicks "Continue to Payment"
- **THEN** validation error shows "ZIP code is required" and form does not submit

#### Scenario: Email format validation
- **WHEN** user enters "invalidemail" in email field
- **THEN** validation error shows "Please enter a valid email address"

#### Scenario: Save address for future
- **GIVEN** user is authenticated
- **WHEN** user checks "Save this address" checkbox
- **THEN** address is saved to user account for future orders

### Requirement: Saved addresses
The application SHALL allow authenticated users to select from previously saved addresses or add a new address.

#### Scenario: Display saved addresses
- **GIVEN** authenticated user has 2 saved addresses
- **WHEN** user views shipping address step
- **THEN** both addresses are displayed as selectable cards

#### Scenario: Select saved address
- **WHEN** user clicks on a saved address card
- **THEN** that address is selected and form fields are populated

#### Scenario: Add new address
- **WHEN** user clicks "Add New Address" button
- **THEN** empty address form is displayed

### Requirement: Payment method selection
The application SHALL support multiple payment methods: Credit/Debit Card, PayPal, and Cash on Delivery. Payment form SHALL display based on selected method.

#### Scenario: Credit card form display
- **WHEN** user selects "Credit/Debit Card" payment method
- **THEN** form displays fields for Card Number, Cardholder Name, Expiry Date, and CVV

#### Scenario: Card number validation
- **WHEN** user enters card number "4532 1234 5678 9010"
- **THEN** card type (Visa) is detected and appropriate icon is displayed

#### Scenario: Expiry date validation
- **WHEN** user enters expiry date in past (e.g., "01/2020")
- **THEN** validation error shows "Card has expired"

#### Scenario: CVV validation
- **WHEN** user enters CVV "12" (less than 3 digits)
- **THEN** validation error shows "CVV must be 3 or 4 digits"

#### Scenario: PayPal selection
- **WHEN** user selects "PayPal" payment method
- **THEN** PayPal integration button is displayed

#### Scenario: Cash on Delivery selection
- **WHEN** user selects "Cash on Delivery"
- **THEN** no payment form is shown and info message displays "Payment will be collected upon delivery"

### Requirement: Order review
The application SHALL display order summary on review step showing shipping address, payment method, all cart items with quantities and prices, and final total breakdown.

#### Scenario: Review page display
- **WHEN** user reaches review step
- **THEN** page shows complete order details including shipping address, payment method, items list, subtotal, tax, shipping, and total

#### Scenario: Edit shipping from review
- **WHEN** user clicks "Edit" next to shipping address on review page
- **THEN** user is taken back to shipping address step

#### Scenario: Edit payment from review
- **WHEN** user clicks "Edit" next to payment method on review page
- **THEN** user is taken back to payment method step

### Requirement: Place order
The application SHALL validate all data and submit order when user clicks "Place Order" button. Loading state SHALL be shown during submission.

#### Scenario: Successful order placement
- **GIVEN** all checkout data is valid
- **WHEN** user clicks "Place Order"
- **THEN** order is created, payment is processed, cart is cleared, and user is redirected to order confirmation page

#### Scenario: Order placement with loading
- **WHEN** user clicks "Place Order"
- **THEN** button shows loading spinner and is disabled until order processing completes

#### Scenario: Order placement error
- **GIVEN** payment processing fails
- **WHEN** order submission completes
- **THEN** error message displays "Payment failed. Please try again or use a different payment method"

### Requirement: Order confirmation
The application SHALL display order confirmation page with order number, estimated delivery date, and order summary after successful checkout.

#### Scenario: Confirmation page display
- **GIVEN** order was placed successfully
- **WHEN** user is redirected to confirmation page
- **THEN** page shows order number, success message, estimated delivery date, and order details

#### Scenario: Confirmation email trigger
- **WHEN** order is placed successfully
- **THEN** confirmation email is sent to user's email address

### Requirement: Guest checkout
The application SHALL allow guest users to checkout without creating an account, but require email for order confirmation.

#### Scenario: Guest checkout flow
- **GIVEN** user is not authenticated
- **WHEN** user proceeds to checkout
- **THEN** shipping form includes email field and "Checkout as Guest" option is available

#### Scenario: Create account prompt after order
- **GIVEN** guest user completed checkout
- **WHEN** order confirmation page displays
- **THEN** page shows "Create account to track your order" button

### Requirement: Promo code application
The application SHALL provide a promo code input field that applies discounts to order total when valid code is entered.

#### Scenario: Apply valid promo code
- **GIVEN** promo code "SAVE10" gives 10% discount
- **WHEN** user enters "SAVE10" and clicks "Apply"
- **THEN** discount is applied, total is recalculated, and success message shows "Promo code applied: 10% off"

#### Scenario: Invalid promo code
- **WHEN** user enters "INVALID123" and clicks "Apply"
- **THEN** error message shows "Invalid or expired promo code"

#### Scenario: Remove promo code
- **GIVEN** promo code is applied
- **WHEN** user clicks "Remove" next to applied promo code
- **THEN** discount is removed and total is recalculated

### Requirement: Shipping method selection
The application SHALL offer multiple shipping methods with different costs and delivery times: Standard (5-7 days, $5.99), Express (2-3 days, $12.99), Next Day ($24.99).

#### Scenario: Shipping method selection
- **WHEN** user selects "Express Shipping"
- **THEN** shipping cost updates to $12.99 and total is recalculated

#### Scenario: Free shipping applies to standard only
- **GIVEN** cart total is over $50
- **WHEN** user views shipping methods
- **THEN** Standard shipping shows "$0.00 (Free!)" but Express and Next Day show regular prices
