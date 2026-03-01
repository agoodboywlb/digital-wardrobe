## MODIFIED Requirements

### Requirement: Multi-image upload UI
The AddItemPage and EditItemPage SHALL provide a multi-image upload area that displays a grid of image thumbnails with an "add" button.

#### Scenario: Upload multiple images on add page
- **WHEN** a user is on AddItemPage and selects 3 images
- **THEN** all 3 images SHALL be displayed as thumbnails in the upload area, with the first image marked as primary

#### Scenario: Delete an image from upload area
- **WHEN** a user taps the delete icon on a thumbnail
- **THEN** the image SHALL be removed from the upload list and the grid SHALL re-render

#### Scenario: Edit existing item images
- **WHEN** a user opens EditItemPage for an item with 2 existing images
- **THEN** the 2 existing images SHALL be displayed as thumbnails, with option to add more (up to 8 total), delete, or reorder

#### Scenario: Loading state with skeleton
- **WHEN** the item data or images are being loaded on EditItemPage
- **THEN** the upload area SHALL display skeleton placeholders for the thumbnails

### Requirement: Image gallery on detail page
The ItemDetailPage SHALL display all item images in a swipeable gallery with pagination indicators.

#### Scenario: Multiple images available
- **WHEN** a user views an item with 4 images
- **THEN** the gallery SHALL display the primary image first, with dots/indicators showing 4 pages, and the user SHALL be able to swipe left/right to navigate

#### Scenario: Single image (backward compatible)
- **WHEN** a user views an item that only has `items.image_url` and no `item_images` records
- **THEN** the detail page SHALL display the single image as before, with no gallery indicators

#### Scenario: Full-screen preview
- **WHEN** a user taps on an image in the gallery
- **THEN** a full-screen overlay SHALL display the image with pinch-to-zoom and swipe-to-dismiss

#### Scenario: Loading state with skeleton
- **WHEN** the item detail is being loaded
- **THEN** the gallery area SHALL display a skeleton placeholder for the primary image
