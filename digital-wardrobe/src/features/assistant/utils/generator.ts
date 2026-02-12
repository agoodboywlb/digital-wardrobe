import type { ClothingItem } from '@/types/index';
import { Category } from '@/types/index';
import type { WeatherData, RecommendationRule, RecommendationResult } from '../types';

export const generateRecommendation = (
    items: ClothingItem[],
    weather: WeatherData
): RecommendationResult => {
    const temp = weather.temp;
    let reason = `根据${weather.city}今日天气 (${weather.condition}, ${temp}°C) 为您推荐：`;

    // 定义规则
    const rule: RecommendationRule = {
        requiredCategories: [Category.Tops, Category.Bottoms],
        optionalCategories: [Category.Accessories],
        chanceToIncludeOptional: 0.3,
    };

    if (temp < 15) {
        rule.requiredCategories.push(Category.Outerwear);
        reason += '天气较凉，建议增加一件外套。';
    } else if (temp > 28) {
        reason += '天气炎热，建议穿着透气轻便。';
    } else {
        reason += '气温适宜，基础搭配即可。';
    }

    const selectedItems: ClothingItem[] = [];

    // 必须类别
    rule.requiredCategories.forEach((cat) => {
        const pool = items.filter((i) => i.category === cat && i.status === 'in_wardrobe');
        if (pool.length > 0) {
            const random = pool[Math.floor(Math.random() * pool.length)];
            if (random) selectedItems.push(random);
        }
    });

    // 可选类别
    if (rule.optionalCategories && Math.random() < (rule.chanceToIncludeOptional || 0)) {
        rule.optionalCategories.forEach((cat) => {
            const pool = items.filter((i) => i.category === cat && i.status === 'in_wardrobe');
            if (pool.length > 0) {
                const random = pool[Math.floor(Math.random() * pool.length)];
                if (random) selectedItems.push(random);
            }
        });
    }

    return {
        items: selectedItems,
        reason,
        weather,
    };
};
