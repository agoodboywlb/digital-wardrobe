## ADDED Requirements

### Requirement: Pinyin initial letter search
The search functionality SHALL support matching Chinese content by pinyin initial letters. When the user types alphabetic characters in the search bar, the system SHALL match items whose name, brand, or tags contain Chinese characters with matching pinyin initials.

#### Scenario: Single pinyin initial match
- **WHEN** the user types "s" in the search bar
- **THEN** the wardrobe list SHALL include items whose name, brand, or tags contain Chinese characters starting with pinyin initial "s" (e.g., "上装" → s, "衬衫" → cs matches s)

#### Scenario: Multiple pinyin initials match
- **WHEN** the user types "sz" in the search bar
- **THEN** the wardrobe list SHALL include items whose name, brand, or tags contain consecutive Chinese characters with pinyin initials matching "s" then "z" (e.g., "上装" → sz)

#### Scenario: Mixed Chinese and pinyin search
- **WHEN** the user types "上z" in the search bar
- **THEN** the search SHALL fall back to the standard Chinese substring matching behavior (pinyin matching only activates when the entire search term is alphabetic)

#### Scenario: Case insensitive pinyin search
- **WHEN** the user types "SZ" in the search bar
- **THEN** the behavior SHALL be identical to typing "sz" (case-insensitive matching)

#### Scenario: Coexistence with standard search
- **WHEN** the user types "Nike" in the search bar
- **THEN** the standard substring matching (name, brand, tag) SHALL work as before; pinyin matching SHALL also be attempted, and results from both strategies SHALL be combined (union)

#### Scenario: Polyphone character handling
- **WHEN** an item name contains a polyphone character like "长" (cháng/zhǎng)
- **THEN** the pinyin matching SHALL consider all possible readings, matching both "c" and "z" as valid initials

---

### Requirement: Pinyin index pre-computation
The system SHALL pre-compute pinyin initial letter indices for all items when the wardrobe data is loaded, to avoid per-keystroke pinyin computation overhead.

#### Scenario: Index built on data load
- **WHEN** the wardrobe items are fetched and loaded into state
- **THEN** the system SHALL compute and cache the pinyin initial strings for each item's name, brand, and tags

#### Scenario: Index used for search
- **WHEN** the user types a search term that triggers pinyin matching
- **THEN** the system SHALL search against the pre-computed pinyin index rather than computing pinyin on each keystroke

#### Scenario: Lazy loading of pinyin library
- **WHEN** the WardrobePage is loaded for the first time
- **THEN** the pinyin processing library SHALL be loaded via dynamic import (`import()`) to avoid blocking the initial page render
