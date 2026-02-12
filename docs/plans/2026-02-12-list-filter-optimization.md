# Implementation Plan - List Filter Optimization

> **Feature**: List Filter Optimization
> **Goal**: Enhance wardrobe list filtering with Brand/Price filters and Pinyin search support.
> **Architecture**: Frontend-only logic extension (React Hooks + Utils), no backend changes.
> **Tech Stack**: React, TypeScript, pinyin-pro, Tailwind CSS.

## 1. Infrastructure & Dependencies

- [ ] **1.1 Install `pinyin-pro`** <!-- in_progress -->
    - **Files**: `package.json`
    - **Step**: Install dependency.
    - **Command**: `npm install pinyin-pro`

- [ ] **1.2 Update `AdvancedFilterDrawerProps` Type Definition** <!-- in_progress -->
    - **Files**: `wardrobe-front/src/features/wardrobe/components/AdvancedFilterDrawer.tsx`
    - **Step**: extending the interface to include brand and price props.
    - **Code**:
      ```typescript
      // Add to AdvancedFilterDrawerProps interface
      activeBrands: string[];
      onSelectBrand: (brand: string) => void;
      availableBrands: string[]; // Pass pre-calculated unique brands
      priceRange: { min: number; max: number } | null;
      onSetPriceRange: (range: { min: number; max: number } | null) => void;
      ```

## 2. Pinyin Search Logic (TDD Core)

- [ ] **2.1 Create `src/utils/helpers/pinyinSearch.ts` Test Suite** <!-- in_progress -->
    - **Files**: `wardrobe-front/src/utils/helpers/__tests__/pinyinSearch.test.ts`
    - **Step**: Create test file with scenarios from `specs/pinyin-search/spec.md`.
    - **Scenarios**:
        - Should return true for single initial match ("s" matches "上装")
        - Should return true for multiple initial match ("sz" matches "上装")
        - Should handle case insensitivity ("SZ" matches "上装")
        - Should handle polyphones ("c" and "z" both match "长")
        - Should return false for non-match
    - **Command**: `npx vitest run pinyinSearch` (will fail initially)

- [ ] **2.2 Implement `src/utils/helpers/pinyinSearch.ts`**
    - **Files**: `wardrobe-front/src/utils/helpers/pinyinSearch.ts`
    - **Step**: Implement `getPinyinInitials` and `matchPinyin` functions using `pinyin-pro`.
    - **Details**:
        - Lazy load `pinyin-pro` if possible, or just import top-level if lightweight enough (using dynamic import for optimization as per specs).
        - **Note**: For this plan, we'll start with standard import for simplicity in util, but `useWardrobe` can handle lazy loading the heavy part if needed. Actually, specs say "Lazy loading of pinyin library", so `pinyinSearch.ts` should probably expose an async init or functional approach. Let's make it a standard module but usage in hook will be async/effect-based.
        - *Correction*: `pinyin-pro` is small, but spec requires lazy load. Let's implement `getPinyinInitials` to async import `pinyin`.
    - **Code Snippet**:
      ```typescript
      // src/utils/helpers/pinyinSearch.ts
      import { pinyin } from 'pinyin-pro'; // Check if we can dynamic import inside

      export const getPinyinInitials = (text: string): string => {
        // Implementation using pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' })
        // Handle polyphones joined
      };
      
      export const matchPinyin = (text: string, query: string): boolean => {
         // ...
      }
      ```
    - **Command**: `npx vitest run pinyinSearch` (must pass)

## 3. Integrate Pinyin Search into `useWardrobe`

- [ ] **3.1 Add State for Pinyin Index**
    - **Files**: `wardrobe-front/src/features/wardrobe/hooks/useWardrobe.ts`
    - **Step**: Add `pinyinIndex` state/ref to store pre-computed initials for items.
    - **Detail**: Use `useEffect` dependent on `items` to regenerate index.

- [ ] **3.2 Update Filter Logic for Search**
    - **Files**: `wardrobe-front/src/features/wardrobe/hooks/useWardrobe.ts`
    - **Step**: Modify the search filtering block.
    - **Logic**:
      ```typescript
      // Pseudo-code
      if (searchTerm) {
          const isAlpha = /^[a-zA-Z]+$/.test(searchTerm);
          if (isAlpha) {
              // Check standard match OR pinyin match
          } else {
              // Standard match only
          }
      }
      ```
    - **Verification**: Run app, type "s" and see if "上装" items appear.

## 4. Brand Filtering Logic & UI

- [ ] **4.1 Compute `availableBrands` in `useWardrobe`**
    - **Files**: `wardrobe-front/src/features/wardrobe/hooks/useWardrobe.ts`
    - **Step**: Add memoized calculation to extract unique brands from `items`.
    - **Logic**: Deduplicate, normalize (trim, lowercase check), sort by frequency.

- [ ] **4.2 Add `activeBrands` State**
    - **Files**: `wardrobe-front/src/features/wardrobe/hooks/useWardrobe.ts`
    - **Step**: `const [activeBrands, setActiveBrands] = useState<string[]>([])`
    - **Step**: Update `filteredItems` to check `activeBrands.includes(item.brand)`.

- [ ] **4.3 Implement Brand Section in `AdvancedFilterDrawer`**
    - **Files**: `wardrobe-front/src/features/wardrobe/components/AdvancedFilterDrawer.tsx`
    - **Step**: Add UI section "品牌".
    - **UI**: Map `availableBrands` to Chips.
    - **Interaction**: Toggle brand in `activeBrands` array.
    - **Requirement**: "Show All" button if > 12 brands.

## 5. Price Filtering Logic & UI

- [ ] **5.1 Add `priceRange` State**
    - **Files**: `wardrobe-front/src/features/wardrobe/hooks/useWardrobe.ts`
    - **Step**: `const [priceRange, setPriceRange] = useState<{min: number, max: number} | null>(null)`
    - **Step**: Update `filteredItems` to check price within range.

- [ ] **5.2 Implement Price Section in `AdvancedFilterDrawer`**
    - **Files**: `wardrobe-front/src/features/wardrobe/components/AdvancedFilterDrawer.tsx`
    - **Step**: Add UI section "价格区间".
    - **UI**:
        - 4 Preset Buttons: `0-100`, `100-300`, `300-500`, `500+`
        - Custom Inputs: Min / Max number inputs.
    - **Logic**: Update `priceRange` state on change.

## 6. Filter State Indicators (Tags)

- [ ] **6.1 Add Filter Tags to `WardrobeHeader` / Page**
    - **Files**: `wardrobe-front/src/pages/WardrobePage.tsx`
    - **Step**: In the active filters section (where Season/Status tags are), add Brand and Price tags.
    - **Step**: Implement "X" click handler to call `setActiveBrands` (remove specific) or `setPriceRange(null)`.

- [ ] **6.2 Update `resetFilters`**
    - **Files**: `wardrobe-front/src/features/wardrobe/hooks/useWardrobe.ts`
    - **Step**: Ensure `resetFilters` clears brands and price range too.

## 7. Final Verification

- [ ] **7.1 Manual E2E Test**
    - **Step**:
        1. Search "sz" -> Expect "上装" items.
        2. Open Filter -> Select Brand "Nike" -> Expect Nike items.
        3. Select Price "100-300" -> Expect items in range.
        4. Check Tags -> Click "X" on Price -> Price filter removed.
        5. Reset -> All filters cleared.
    - **Command**: `npm run dev` and manual verification.

