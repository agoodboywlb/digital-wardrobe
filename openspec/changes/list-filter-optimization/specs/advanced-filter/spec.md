## ADDED Requirements

### Requirement: Brand filter in advanced filter panel
The AdvancedFilterDrawer SHALL display a "品牌" (Brand) filter section that dynamically lists all unique brands from the user's wardrobe items, supporting multi-select.

#### Scenario: Brand list rendered from existing items
- **WHEN** the user opens the advanced filter panel and their wardrobe contains items with brands "Nike", "Uniqlo", "Zara", and "Nike"
- **THEN** the brand filter section SHALL display 3 unique brand chips: "Nike", "Uniqlo", "Zara", with duplicates deduplicated and brands sorted by frequency (descending)

#### Scenario: Select multiple brands
- **WHEN** the user taps on "Nike" and then "Zara" in the brand filter
- **THEN** both chips SHALL be visually highlighted as active, and the wardrobe list SHALL show only items whose brand matches "Nike" OR "Zara"

#### Scenario: Deselect a brand
- **WHEN** the user taps on an already-selected brand chip "Nike"
- **THEN** the "Nike" chip SHALL be deselected, and the wardrobe list SHALL update to show only items matching remaining active brands (or all items if no brand is selected)

#### Scenario: No brands available
- **WHEN** the user opens the advanced filter panel and no items have a brand value
- **THEN** the brand filter section SHALL display a disabled placeholder text "暂无品牌数据"

#### Scenario: Brand list truncation and expand
- **WHEN** the user has more than 12 unique brands
- **THEN** the brand filter section SHALL display the top 12 brands (by frequency) with an "展开全部" button, and tapping it SHALL reveal all brands

#### Scenario: Brand name normalization
- **WHEN** the user's items contain brands "Nike", "nike", " NIKE "
- **THEN** the brand filter SHALL treat them as a single brand "Nike" (trimmed, case-insensitive dedup, display the most common casing)

---

### Requirement: Price range filter in advanced filter panel
The AdvancedFilterDrawer SHALL display a "价格区间" (Price Range) filter section with preset range buttons and optional custom min/max inputs.

#### Scenario: Preset price ranges displayed
- **WHEN** the user opens the advanced filter panel
- **THEN** the price range section SHALL display 4 preset buttons: "¥0-100", "¥100-300", "¥300-500", "¥500+"

#### Scenario: Select a preset range
- **WHEN** the user taps "¥100-300"
- **THEN** the button SHALL be highlighted as active, and the wardrobe list SHALL show only items with price >= 100 AND price < 300

#### Scenario: Select the unbounded range
- **WHEN** the user taps "¥500+"
- **THEN** the wardrobe list SHALL show only items with price >= 500 (no upper bound)

#### Scenario: Custom price range input
- **WHEN** the user enters 200 in the min input and 800 in the max input
- **THEN** the wardrobe list SHALL show only items with price >= 200 AND price <= 800, and any previously selected preset SHALL be deselected

#### Scenario: Preset syncs with custom inputs
- **WHEN** the user selects preset "¥100-300"
- **THEN** the custom min input SHALL display "100" and the custom max input SHALL display "300"

#### Scenario: Items without price
- **WHEN** an item has no price value (undefined/null) and a price filter is active
- **THEN** the item SHALL be excluded from the filtered results

#### Scenario: Deselect price filter
- **WHEN** the user taps the currently active preset range button
- **THEN** the price filter SHALL be cleared and all items SHALL be shown (subject to other active filters)

---

### Requirement: Filter state indicator tags
The WardrobePage SHALL display active filter state as removable tag chips below the filter bar for all active dimensions (season, status, brand, price range).

#### Scenario: Brand filter tags displayed
- **WHEN** the user has selected brands "Nike" and "Zara" in the advanced filter
- **THEN** the filter indicator area SHALL display tags "品牌: Nike" and "品牌: Zara" with remove (×) icons

#### Scenario: Price range tag displayed
- **WHEN** the user has set a price range of ¥100-300
- **THEN** the filter indicator area SHALL display a tag "价格: ¥100-300" with a remove (×) icon

#### Scenario: Remove individual filter tag
- **WHEN** the user taps the × icon on the "品牌: Nike" tag
- **THEN** the "Nike" brand filter SHALL be removed, and the wardrobe list SHALL update accordingly

#### Scenario: Reset all filters
- **WHEN** the user taps the "重置" button in the advanced filter panel
- **THEN** all filter dimensions (category, season, status, brand, price range) SHALL be cleared
