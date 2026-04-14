## ADDED Requirements

### Requirement: Product listing page
The application SHALL display a grid of products with image, title, price, rating, and "Add to Cart" button. Products SHALL be filterable by category, price range, and rating, and sortable by price (low-to-high, high-to-low), name, and rating.

#### Scenario: Product grid display
- **WHEN** user visits `/products`
- **THEN** the page displays products in a responsive grid (1 column mobile, 2 tablet, 3-4 desktop)

#### Scenario: Filter by category
- **GIVEN** user is on the products page
- **WHEN** user selects "Electronics" category filter
- **THEN** only products in Electronics category are displayed

#### Scenario: Filter by price range
- **WHEN** user sets price filter to $50-$100
- **THEN** only products within that price range are displayed

#### Scenario: Sort by price
- **WHEN** user selects "Price: Low to High" sort option
- **THEN** products are reordered with lowest price first

#### Scenario: Search products
- **WHEN** user searches for "laptop"
- **THEN** only products matching "laptop" in title or description are displayed

### Requirement: Product detail page
The application SHALL display comprehensive product information including image gallery, title, price, description, specifications, availability status, quantity selector, and "Add to Cart" button. Related products SHALL be shown at the bottom.

#### Scenario: Product detail display
- **WHEN** user clicks on a product or visits `/products/123`
- **THEN** the product detail page shows all product information

#### Scenario: Image gallery navigation
- **GIVEN** product has multiple images
- **WHEN** user clicks on thumbnail or navigation arrows
- **THEN** main image updates to show selected image

#### Scenario: Add to cart from detail page
- **GIVEN** user selects quantity of 2
- **WHEN** user clicks "Add to Cart"
- **THEN** 2 units of the product are added to cart and a success toast is displayed

#### Scenario: Out of stock product
- **GIVEN** product stock is 0
- **WHEN** user views product detail page
- **THEN** "Add to Cart" button is disabled and "Out of Stock" label is displayed

#### Scenario: Related products display
- **WHEN** user views a product detail page
- **THEN** 4-6 related products from the same category are shown below

### Requirement: Product quick view
The application SHALL provide a quick view modal that opens when user clicks "Quick View" button on product card, showing key product details without navigating away.

#### Scenario: Quick view modal
- **WHEN** user clicks "Quick View" on a product card
- **THEN** a modal opens showing product image, title, price, brief description, and "Add to Cart" button

#### Scenario: Add to cart from quick view
- **WHEN** user adds product to cart from quick view modal
- **THEN** product is added to cart and modal remains open with success message

### Requirement: Product categories
The application SHALL support hierarchical product categories (e.g., Electronics > Laptops > Gaming Laptops) and display category navigation.

#### Scenario: Category navigation
- **WHEN** user clicks on "Electronics" category
- **THEN** the page displays all products in Electronics and its subcategories

#### Scenario: Subcategory filtering
- **WHEN** user selects "Laptops" subcategory under Electronics
- **THEN** only laptop products are displayed

### Requirement: Product search
The application SHALL provide real-time search suggestions as user types, with debouncing (300ms) to reduce API calls.

#### Scenario: Search suggestions
- **WHEN** user types "lap" in search bar
- **THEN** dropdown shows matching products and categories containing "lap"

#### Scenario: Search results page
- **WHEN** user submits search for "laptop"
- **THEN** the products page displays filtered results with search term highlighted

### Requirement: Product ratings and reviews
The application SHALL display average product rating (1-5 stars) and review count on product cards and detail pages.

#### Scenario: Rating display on card
- **GIVEN** product has average rating of 4.5 from 120 reviews
- **WHEN** product card renders
- **THEN** it shows 4.5 star rating and "(120 reviews)" text

#### Scenario: Review section on detail page
- **WHEN** user scrolls to reviews section on product detail page
- **THEN** individual reviews with rating, reviewer name, date, and comment are displayed

### Requirement: Product pagination
The application SHALL paginate product listings with 12 products per page and provide page navigation controls.

#### Scenario: Pagination controls
- **GIVEN** there are 50 products in search results
- **WHEN** user views products page
- **THEN** pagination shows pages 1-5 with next/previous buttons

#### Scenario: Navigate to page 2
- **WHEN** user clicks page 2
- **THEN** products 13-24 are displayed and URL updates to `/products?page=2`

### Requirement: Wishlist functionality
The application SHALL allow users to add products to a wishlist (heart icon on product cards) with visual feedback.

#### Scenario: Add to wishlist
- **WHEN** user clicks heart icon on product card
- **THEN** product is added to wishlist, heart icon fills with color, and toast shows "Added to wishlist"

#### Scenario: Remove from wishlist
- **GIVEN** product is in wishlist
- **WHEN** user clicks filled heart icon
- **THEN** product is removed from wishlist and heart icon returns to outline state
