import { useState, useEffect, useMemo } from 'react';

import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { getPinyinInitials, matchPinyin } from '@/utils/helpers/pinyinSearch';

import type { ClothingItem } from '@/types/index';

const CATEGORIES = ['全部', '上装', '下装', '外套', '鞋履', '配饰'];

export const useWardrobe = () => {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSeason, setActiveSeason] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState<string | null>(null);

    // New Filters
    const [activeBrands, setActiveBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

    // Pinyin Index: itemId -> strings[]
    const [pinyinIndex, setPinyinIndex] = useState<Record<string, string[]>>({});

    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await wardrobeService.fetchItems();
                setItems(data);
            } catch (err) {
                console.error("Failed to load items", err);
                setError(err instanceof Error ? err : new Error('Failed to load items'));
            } finally {
                setLoading(false);
            }
        };
        void loadItems();
    }, []);

    // Generate Pinyin Index when items load
    useEffect(() => {
        if (items.length === 0) {return;}

        const generateIndex = async () => {
            const index: Record<string, string[]> = {};
            // Use Promise.all if items are many? But loop is fine for now.
            // getPinyinInitials handles dynamic import, might be async.

            // Process in chunks or just loop. JS is single threaded.
            for (const item of items) {
                const fields = [item.name, item.brand, ...item.tags].filter(Boolean) as string[];
                const allInitials: string[] = [];
                for (const field of fields) {
                    const initials = await getPinyinInitials(field);
                    allInitials.push(...initials);
                }
                index[item.id] = Array.from(new Set(allInitials));
            }
            setPinyinIndex(index);
        };
        void generateIndex();
    }, [items]);

    const getCategoryValue = (label: string) => {
        switch (label) {
            case '上装': return 'tops';
            case '下装': return 'bottoms';
            case '外套': return 'outerwear';
            case '鞋履': return 'footwear';
            case '配饰': return 'accessories';
            default: return 'all';
        }
    };

    const getStatusValue = (label: string) => {
        switch (label) {
            case '在馆': return 'in_wardrobe';
            case '待洗': return 'to_wash';
            case '维修': return 'at_tailor';
            case '干洗': return 'dry_cleaning';
            default: return null;
        }
    };

    const getSeasonValue = (label: string) => {
        switch (label) {
            case '春': return 'spring';
            case '夏': return 'summer';
            case '秋': return 'autumn';
            case '冬': return 'winter';
            default: return null;
        }
    };

    // Calculate Available Brands (memoized)
    const availableBrands = useMemo(() => {
        const brandCounts: Record<string, number> = {};
        for (const item of items) {
            // Check if brand exists and is string
            if (item.brand && typeof item.brand === 'string') {
                const brand = item.brand.trim();
                if (brand) {
                    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
                }
            }
        }

        // Case-insensitive merge logic
        const mergedCounts: Record<string, { count: number, original: string }> = {};
        Object.entries(brandCounts).forEach(([brand, count]) => {
            const key = brand.toLowerCase();
            if (!mergedCounts[key]) {
                mergedCounts[key] = { count: 0, original: brand };
            }
            mergedCounts[key].count += count;
            // Keep the casing that is most frequent (if current count > existing original's count)
            if (count > (brandCounts[mergedCounts[key].original] || 0)) {
                mergedCounts[key].original = brand;
            }
        });

        return Object.values(mergedCounts)
            .sort((a, b) => b.count - a.count)
            .map(x => x.original);
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Category Filter
            let matchesCategory = true;
            if (activeCategory !== '全部') {
                const targetCategory = getCategoryValue(activeCategory);
                matchesCategory = item.category === targetCategory;
            }

            // Search Filter
            let matchesSearch = true;
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                // Standard match
                const standardMatch = item.name.toLowerCase().includes(lowerTerm) ||
                    (item.brand && item.brand.toLowerCase().includes(lowerTerm)) ||
                    item.tags.some(tag => tag.toLowerCase().includes(lowerTerm));

                // Pinyin match
                let pinyinMatch = false;
                if (/^[a-zA-Z]+$/.test(searchTerm)) {
                    const itemInitials = pinyinIndex[item.id];
                    if (itemInitials) {
                        pinyinMatch = matchPinyin(itemInitials, searchTerm);
                    }
                }

                matchesSearch = standardMatch || pinyinMatch;
            }

            // Season Filter
            let matchesSeason = true;
            if (activeSeason) {
                const targetSeason = getSeasonValue(activeSeason);
                matchesSeason = item.tags.some(tag => tag === activeSeason || tag === targetSeason);
            }

            // Status Filter
            let matchesStatus = true;
            if (activeStatus) {
                const targetStatus = getStatusValue(activeStatus);
                matchesStatus = item.status === targetStatus;
            }

            // Brand Filter
            let matchesBrand = true;
            if (activeBrands.length > 0) {
                if (!item.brand) {
                    matchesBrand = false;
                } else {
                    const itemBrandLower = item.brand.trim().toLowerCase();
                    matchesBrand = activeBrands.some(b => b.toLowerCase() === itemBrandLower);
                }
            }

            // Price Filter
            let matchesPrice = true;
            if (priceRange) {
                if (item.price === undefined || item.price === null) {
                    matchesPrice = false;
                } else {
                    matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
                }
            }

            return matchesCategory && matchesSearch && matchesSeason && matchesStatus && matchesBrand && matchesPrice;
        });
    }, [items, activeCategory, searchTerm, activeSeason, activeStatus, activeBrands, priceRange, pinyinIndex]);

    return {
        items,
        filteredItems,
        loading,
        error,
        categories: CATEGORIES,
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        activeSeason,
        setActiveSeason,
        activeStatus,
        setActiveStatus,
        // New State Exports
        activeBrands,
        setActiveBrands,
        availableBrands,
        priceRange,
        setPriceRange,
        resetFilters: () => {
            setActiveCategory('全部');
            setSearchTerm('');
            setActiveSeason(null);
            setActiveStatus(null);
            setActiveBrands([]);
            setPriceRange(null);
        }
    };
};
