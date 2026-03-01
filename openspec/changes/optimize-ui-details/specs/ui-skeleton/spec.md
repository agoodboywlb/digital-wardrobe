## ADDED Requirements

### Requirement: Skeleton screens for data fetching
The system SHALL display skeleton screens (placeholders) instead of loading spinners when fetching data for lists or details.

#### Scenario: List page loading
- **WHEN** a user navigates to a list page (e.g., wardrobe list) and data is being fetched
- **THEN** a grid of skeleton cards matching the item card layout SHALL be displayed

#### Scenario: Detail page loading
- **WHEN** a user navigates to an item detail page and data is being fetched
- **THEN** skeleton placeholders for the image gallery and text fields SHALL be displayed

### Requirement: Global skeleton component
The system SHALL provide a reusable `Skeleton` component that can be used to build complex loading states.

#### Scenario: Custom skeleton layout
- **WHEN** a developer needs a loading state for a custom component
- **THEN** they SHALL be able to use the `Skeleton` component with configurable width, height, and shape (circle/rect)
