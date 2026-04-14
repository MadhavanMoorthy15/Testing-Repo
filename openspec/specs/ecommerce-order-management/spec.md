## ADDED Requirements

### Requirement: Order creation
The application SHALL create order records with unique order number, timestamp, user ID, items, quantities, prices, shipping address, payment method, and initial status "Processing".

#### Scenario: Order record creation
- **GIVEN** user completes checkout
- **WHEN** order is placed
- **THEN** order record is created with all checkout data and unique order number (e.g., "ORD-20260413-001")

#### Scenario: Order number generation
- **WHEN** multiple orders are created
- **THEN** each order has unique order number with format "ORD-YYYYMMDD-XXX"

### Requirement: Order status tracking
The application SHALL support order statuses: Processing, Confirmed, Shipped, Out for Delivery, Delivered, Cancelled, and Refunded. Status SHALL update based on order lifecycle.

#### Scenario: New order status
- **WHEN** order is first created
- **THEN** status is set to "Processing"

#### Scenario: Status progression
- **GIVEN** order status is "Processing"
- **WHEN** payment is confirmed
- **THEN** status updates to "Confirmed"

#### Scenario: Shipping status
- **GIVEN** order status is "Confirmed" and items are shipped
- **WHEN** tracking number is added
- **THEN** status updates to "Shipped"

#### Scenario: Delivery status
- **GIVEN** order status is "Out for Delivery"
- **WHEN** order is delivered
- **THEN** status updates to "Delivered" and delivery timestamp is recorded

### Requirement: Order cancellation
The application SHALL allow users to cancel orders that have status "Processing" or "Confirmed". Cancelled orders cannot be un-cancelled.

#### Scenario: Cancel eligible order
- **GIVEN** order status is "Processing"
- **WHEN** user clicks "Cancel Order" and confirms
- **THEN** order status updates to "Cancelled" and cancellation timestamp is recorded

#### Scenario: Cancel ineligible order
- **GIVEN** order status is "Shipped"
- **WHEN** user attempts to cancel
- **THEN** error message shows "This order cannot be cancelled. Please contact support."

#### Scenario: Refund after cancellation
- **GIVEN** order is cancelled and was paid
- **WHEN** cancellation is processed
- **THEN** refund is initiated and user is notified

### Requirement: Order timeline
The application SHALL maintain timeline of all order events (created, confirmed, shipped, delivered, cancelled) with timestamps.

#### Scenario: Timeline display
- **WHEN** user views order details
- **THEN** timeline shows all events with dates and times in chronological order

#### Scenario: Timeline updates
- **WHEN** order status changes
- **THEN** new event is added to timeline with current timestamp

### Requirement: Inventory management
The application SHALL reduce product stock quantity when order is placed and restore stock if order is cancelled.

#### Scenario: Stock reduction on order
- **GIVEN** product has 10 units in stock and user orders 2 units
- **WHEN** order is placed
- **THEN** product stock reduces to 8 units

#### Scenario: Stock restoration on cancellation
- **GIVEN** order with 2 units is cancelled
- **WHEN** cancellation is processed
- **THEN** product stock increases by 2 units

#### Scenario: Prevent overselling
- **GIVEN** product has 1 unit in stock
- **WHEN** user tries to order 2 units
- **THEN** error shows "Insufficient stock. Only 1 unit available."

### Requirement: Order search and filtering
The application SHALL allow users to search orders by order number and filter by status and date range.

#### Scenario: Search by order number
- **WHEN** user enters "ORD-20260413-001" in search
- **THEN** matching order is displayed

#### Scenario: Filter by status
- **WHEN** user selects "Shipped" status filter
- **THEN** only orders with "Shipped" status are displayed

#### Scenario: Filter by date range
- **WHEN** user selects date range "Last 30 days"
- **THEN** only orders from past 30 days are displayed

### Requirement: Order notifications
The application SHALL send email notifications for order events: order placed, payment confirmed, order shipped, order delivered, order cancelled.

#### Scenario: Order placed notification
- **WHEN** user places order
- **THEN** email is sent with subject "Order Confirmation #[order_number]"

#### Scenario: Shipping notification
- **WHEN** order status updates to "Shipped"
- **THEN** email is sent with tracking number and estimated delivery date

#### Scenario: Delivery notification
- **WHEN** order is delivered
- **THEN** email is sent confirming delivery and requesting review

### Requirement: Re-order functionality
The application SHALL allow users to quickly re-order by adding all items from a previous order to cart.

#### Scenario: Re-order from order history
- **WHEN** user clicks "Order Again" on previous order
- **THEN** all items from that order are added to cart

#### Scenario: Re-order with out-of-stock items
- **GIVEN** previous order contains item that is now out of stock
- **WHEN** user clicks "Order Again"
- **THEN** available items are added to cart and notification shows which items are unavailable

### Requirement: Order receipt/invoice
The application SHALL generate PDF receipts/invoices for completed orders with all order details, itemized pricing, and company information.

#### Scenario: Download invoice
- **WHEN** user clicks "Download Invoice" on order
- **THEN** PDF invoice is generated and downloaded

#### Scenario: Invoice contents
- **WHEN** invoice is generated
- **THEN** it contains company logo, order number, date, billing/shipping address, itemized list, subtotal, tax, shipping, total, and payment method

### Requirement: Order reviews
The application SHALL allow users to review and rate products from delivered orders.

#### Scenario: Review prompt
- **GIVEN** order status is "Delivered"
- **WHEN** user views order details
- **THEN** "Write a Review" button is displayed for each product

#### Scenario: Submit product review
- **WHEN** user submits review with 5-star rating and comment
- **THEN** review is saved and associated with product and user

#### Scenario: Review already submitted
- **GIVEN** user already reviewed a product from order
- **WHEN** order details display
- **THEN** "Edit Review" button is shown instead of "Write a Review"

### Requirement: Order analytics
The application SHALL track order metrics including total orders, total revenue, average order value, and most popular products.

#### Scenario: User order statistics
- **WHEN** user views account dashboard
- **THEN** statistics show total orders placed and total amount spent

#### Scenario: Popular products tracking
- **WHEN** order contains specific products
- **THEN** product purchase count is incremented for analytics
