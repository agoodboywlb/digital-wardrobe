import { useState, useEffect, useMemo } from 'react';

import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';

import type { ClothingItem } from '@/types/index';

const CATEGORIES = ['全部', '上装', '下装', '外套', '鞋履', '配饰'];

export const useWardrobe = () => {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSeason, setActiveSeason] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState<string | null>(null);
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
                matchesSearch = item.name.toLowerCase().includes(lowerTerm) ||
                    (item.brand && item.brand.toLowerCase().includes(lowerTerm)) ||
                    item.tags.some(tag => tag.toLowerCase().includes(lowerTerm));
            }

            // Season Filter (ClothingItem tags can contain season or we might need a dedicated field)
            // For now assume season might be in tags if dedicated field not present in current mock data logic
            // But types say item might have it? Let's check types.
            let matchesSeason = true;
            if (activeSeason) {
                const targetSeason = getSeasonValue(activeSeason);
                // Based on DB schema, items don't have season but Outfits do. 
                // However, items usually belong to seasons via tags.
                // Let's check for season in tags.
                matchesSeason = item.tags.some(tag => tag === activeSeason || tag === targetSeason);
            }

            // Status Filter
            let matchesStatus = true;
            if (activeStatus) {
                const targetStatus = getStatusValue(activeStatus);
                matchesStatus = item.status === targetStatus;
            }

            return matchesCategory && matchesSearch && matchesSeason && matchesStatus;
        });
    }, [items, activeCategory, searchTerm, activeSeason, activeStatus]);

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
        resetFilters: () => {
            setActiveCategory('全部');
            setSearchTerm('');
            setActiveSeason(null);
            setActiveStatus(null);
        }
    };
};
