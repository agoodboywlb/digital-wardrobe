import type { ClothingItem } from '@/types/index';

export interface WeatherData {
    temp: number;
    condition: string;
    city: string;
    updateTime: string;
}

export interface RecommendationRule {
    minTemp?: number;
    maxTemp?: number;
    requiredCategories: ClothingItem['category'][];
    optionalCategories?: ClothingItem['category'][];
    chanceToIncludeOptional?: number;
}

export interface RecommendationResult {
    items: ClothingItem[];
    reason: string;
    weather: WeatherData;
    title?: string; // AI-generated outfit title
    style_category?: string; // AI-generated style category
}

// AI Service Types
export interface AIServiceClothingItem {
    id: string;
    name: string;
    category: string;
    sub_category?: string;
    color?: string;
    tags: string[];
}

export interface AIServiceRequest {
    items: AIServiceClothingItem[];
    weather?: {
        temp: number;
        condition: string;
        city: string;
    };
    vibe?: string;
}

export interface AIServiceResponse {
    title: string;
    description: string;
    item_ids: string[];
    style_category: string;
}

