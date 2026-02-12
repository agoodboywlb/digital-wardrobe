# Item Management Specification

## Requirements

### Requirement: Item image storage model
The system SHALL store item images in a dedicated `item_images` table with fields: `id` (UUID PK), `item_id` (FK → items), `image_url` (TEXT NOT NULL), `label` (TEXT, nullable), `sort_order` (INTEGER DEFAULT 0), `is_primary` (BOOLEAN DEFAULT false), `created_at` (TIMESTAMPTZ), `user_id` (UUID).

#### Scenario: New image record created
- **WHEN** a user uploads an image for an item
- **THEN** a new row is inserted into `item_images` with the item's `id` as `item_id`, the uploaded URL as `image_url`, and the user's `auth.uid()` as `user_id`

#### Scenario: RLS enforcement
- **WHEN** a user queries `item_images`
- **THEN** only rows where `user_id = auth.uid()` SHALL be returned

#### Scenario: Cascade delete
- **WHEN** an item is deleted from `items`
- **THEN** all associated rows in `item_images` SHALL be automatically deleted via `ON DELETE CASCADE`

---

### Requirement: Maximum image count per item
The system SHALL enforce a maximum of 8 images per item.

#### Scenario: Upload within limit
- **WHEN** a user uploads an image and the item currently has fewer than 8 images
- **THEN** the upload SHALL succeed and the image SHALL be saved

#### Scenario: Upload exceeds limit
- **WHEN** a user attempts to upload an image and the item already has 8 images
- **THEN** the system SHALL reject the upload and display an error message "最多上传 8 张图片"

---

### Requirement: Primary image designation
The system SHALL support designating exactly one image as the primary (cover) image per item. The `items.image_url` field SHALL remain synchronized with the primary image's URL.

#### Scenario: First image becomes primary
- **WHEN** a user uploads the first image for an item
- **THEN** that image SHALL be automatically marked as `is_primary = true` AND `items.image_url` SHALL be updated to the same URL

#### Scenario: User sets a different primary
- **WHEN** a user designates a non-primary image as the primary
- **THEN** the previously primary image SHALL have `is_primary` set to `false`, the new image SHALL have `is_primary` set to `true`, AND `items.image_url` SHALL be updated to match the new primary image's URL

#### Scenario: Primary image deleted
- **WHEN** the primary image is deleted and other images exist
- **THEN** the image with the lowest `sort_order` SHALL become the new primary, AND `items.image_url` SHALL be updated accordingly

#### Scenario: Last image deleted
- **WHEN** the only image is deleted
- **THEN** `items.image_url` SHALL be set to `null`

---

### Requirement: Image label tagging
The system SHALL allow users to assign an optional label to each image from a suggested set: `front` (正面), `back` (背面), `label` (洗标), `worn` (上身图), `detail` (细节), or a custom text value.

#### Scenario: Assign preset label
- **WHEN** a user selects "正面" for an image
- **THEN** the image's `label` field SHALL be set to `front`

#### Scenario: Assign custom label
- **WHEN** a user types a custom label "领口细节"
- **THEN** the image's `label` field SHALL be set to "领口细节"

#### Scenario: No label assigned
- **WHEN** a user does not assign a label
- **THEN** the image's `label` field SHALL remain `null`

---

### Requirement: Image sort ordering
The system SHALL support manual ordering of images via a `sort_order` integer field. Images SHALL be displayed in ascending `sort_order` order.

#### Scenario: Drag reorder
- **WHEN** a user drags an image from position 2 to position 0
- **THEN** the `sort_order` values SHALL be recalculated to reflect the new order

#### Scenario: Default order
- **WHEN** images are uploaded sequentially without manual reordering
- **THEN** images SHALL be ordered by upload time (ascending `sort_order` assigned at creation)

---

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

---

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
