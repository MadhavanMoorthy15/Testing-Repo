## ADDED Requirements

### Requirement: User authentication
The application SHALL support user registration and login with email/password. Passwords SHALL be validated for minimum length (8 characters), at least one uppercase letter, one lowercase letter, and one number.

#### Scenario: Successful registration
- **GIVEN** user provides valid email "user@example.com" and password "SecurePass123"
- **WHEN** user submits registration form
- **THEN** account is created, user is logged in, and redirected to homepage

#### Scenario: Registration with existing email
- **GIVEN** email "user@example.com" is already registered
- **WHEN** user tries to register with same email
- **THEN** error message displays "Email already registered. Please sign in."

#### Scenario: Weak password validation
- **WHEN** user enters password "pass123" (no uppercase)
- **THEN** validation error shows "Password must contain at least one uppercase letter"

#### Scenario: Successful login
- **GIVEN** user has registered account
- **WHEN** user enters correct email and password
- **THEN** user is authenticated and redirected to previously visited page or homepage

#### Scenario: Invalid login credentials
- **WHEN** user enters incorrect password
- **THEN** error message displays "Invalid email or password"

### Requirement: Account dashboard
The application SHALL display account dashboard at `/account` showing user profile summary, recent orders, saved addresses, and wishlist count.

#### Scenario: Dashboard display
- **WHEN** authenticated user navigates to `/account`
- **THEN** dashboard shows user name, email, order count, address count, and wishlist count

#### Scenario: Quick actions
- **WHEN** user views account dashboard
- **THEN** quick action buttons for "View Orders", "Manage Addresses", "Edit Profile", and "View Wishlist" are displayed

### Requirement: Profile management
The application SHALL allow users to view and edit profile information including name, email, phone number, and password.

#### Scenario: View profile
- **WHEN** user navigates to `/account/profile`
- **THEN** profile form displays current user information

#### Scenario: Update profile
- **GIVEN** user changes name to "John Doe"
- **WHEN** user clicks "Save Changes"
- **THEN** profile is updated and success toast shows "Profile updated successfully"

#### Scenario: Change password
- **GIVEN** user enters current password, new password, and confirmation
- **WHEN** user clicks "Update Password"
- **THEN** password is changed and user receives confirmation

#### Scenario: Current password validation
- **WHEN** user enters incorrect current password when changing password
- **THEN** error shows "Current password is incorrect"

### Requirement: Address management
The application SHALL allow users to add, edit, and delete saved shipping addresses. User SHALL be able to set one address as default.

#### Scenario: View saved addresses
- **WHEN** user navigates to `/account/addresses`
- **THEN** all saved addresses are displayed with edit and delete options

#### Scenario: Add new address
- **WHEN** user fills address form and clicks "Save Address"
- **THEN** address is added to saved addresses and success toast shows "Address saved"

#### Scenario: Edit address
- **GIVEN** user clicks edit on an address
- **WHEN** user updates city to "San Francisco" and saves
- **THEN** address is updated in database

#### Scenario: Delete address
- **WHEN** user clicks delete on an address and confirms
- **THEN** address is removed and toast shows "Address deleted"

#### Scenario: Set default address
- **WHEN** user marks an address as default
- **THEN** that address is used automatically during checkout and previous default is unmarked

### Requirement: Order history
The application SHALL display list of all user orders at `/account/orders` with order number, date, status, total, and view details link.

#### Scenario: Orders list display
- **WHEN** user navigates to `/account/orders`
- **THEN** all orders are displayed sorted by date (newest first)

#### Scenario: Empty orders state
- **GIVEN** user has no orders
- **WHEN** user views orders page
- **THEN** message displays "You haven't placed any orders yet" with "Start Shopping" button

#### Scenario: Order status display
- **GIVEN** user has orders with different statuses
- **WHEN** orders list renders
- **THEN** each order shows status badge (Processing, Shipped, Delivered, Cancelled)

### Requirement: Order details
The application SHALL display detailed order information including all items, quantities, prices, shipping address, payment method, and order timeline/tracking.

#### Scenario: Order detail page
- **WHEN** user clicks on order #12345
- **THEN** page displays complete order information and timeline

#### Scenario: Order tracking
- **GIVEN** order status is "Shipped"
- **WHEN** user views order details
- **THEN** tracking number and carrier information are displayed

#### Scenario: Download invoice
- **WHEN** user clicks "Download Invoice" on order details
- **THEN** PDF invoice is generated and downloaded

### Requirement: Wishlist management
The application SHALL allow users to view, add, and remove items from wishlist at `/account/wishlist`.

#### Scenario: Wishlist display
- **WHEN** user navigates to `/account/wishlist`
- **THEN** all wishlist items are displayed in grid format

#### Scenario: Empty wishlist state
- **GIVEN** wishlist is empty
- **WHEN** user views wishlist page
- **THEN** message displays "Your wishlist is empty" with "Browse Products" button

#### Scenario: Add to cart from wishlist
- **WHEN** user clicks "Add to Cart" on wishlist item
- **THEN** item is added to cart and success toast displays

#### Scenario: Remove from wishlist
- **WHEN** user clicks remove icon on wishlist item
- **THEN** item is removed and toast shows "Removed from wishlist"

### Requirement: Social authentication (OAuth)
The application SHALL support sign-in/sign-up with Google and Facebook OAuth providers.

#### Scenario: Google sign-in
- **WHEN** user clicks "Continue with Google" button
- **THEN** Google OAuth flow is initiated

#### Scenario: OAuth account creation
- **GIVEN** user authenticates with Google for first time
- **WHEN** OAuth completes
- **THEN** new account is created using Google profile data and user is logged in

#### Scenario: OAuth existing account
- **GIVEN** user previously signed up with Google
- **WHEN** user authenticates with Google
- **THEN** user is logged into existing account

### Requirement: Logout functionality
The application SHALL allow users to logout, clearing session data from localStorage.

#### Scenario: User logout
- **WHEN** user clicks "Logout" button
- **THEN** user session is cleared, user is logged out, and redirected to homepage

#### Scenario: Session cleanup
- **WHEN** user logs out
- **THEN** authentication token and user data are removed from localStorage

### Requirement: Account deletion
The application SHALL allow users to permanently delete their account with confirmation prompt.

#### Scenario: Request account deletion
- **WHEN** user clicks "Delete Account" in settings
- **THEN** confirmation dialog appears warning about permanent data loss

#### Scenario: Confirm account deletion
- **GIVEN** user confirms account deletion
- **WHEN** user enters password and confirms
- **THEN** account and all associated data are deleted, user is logged out

#### Scenario: Cancel account deletion
- **WHEN** user cancels deletion confirmation
- **THEN** dialog closes and account remains active
