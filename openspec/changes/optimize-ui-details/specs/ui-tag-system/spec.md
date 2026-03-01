## ADDED Requirements

### Requirement: Unified tag styling
The system SHALL provide a unified `Tag` component with distinct visual styles for "attribute tags" and "custom tags".

#### Scenario: Attribute tag display
- **WHEN** an item attribute (e.g., category, color) is displayed as a tag
- **THEN** it SHALL use a neutral grey background with dark text

#### Scenario: Custom tag display
- **WHEN** a user-defined custom tag is displayed
- **THEN** it SHALL use a colored background (based on tag name or random assignment) with white text

### Requirement: Consistent tag dimensions
All tags SHALL have consistent padding, border-radius, and font-size regardless of their type.

#### Scenario: Mixed tags in a list
- **WHEN** attribute tags and custom tags are displayed together
- **THEN** they SHALL have the same height and vertical alignment
