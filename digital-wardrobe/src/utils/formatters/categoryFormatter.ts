/**
 * 品类和季节的中英文映射工具
 * 用于将数据库中的英文值转换为用户友好的中文显示
 */

export const CATEGORY_LABELS: Record<string, string> = {
    // 品类
    'tops': '上装',
    'bottoms': '下装',
    'outerwear': '外套',
    'footwear': '鞋履',
    'accessories': '配饰',

    // 季节
    'spring': '春季',
    'summer': '夏季',
    'autumn': '秋季',
    'winter': '冬季'
};

export const CATEGORY_COLORS: Record<string, string> = {
    'tops': '#FAC638',
    'bottoms': '#61896f',
    'outerwear': '#8faea0',
    'footwear': '#e5e7eb',
    'accessories': '#d1d5db'
};

/**
 * 将英文品类/季节转换为中文
 * @param category 英文品类或季节标识（如 'tops', 'winter'）
 * @returns 中文标签，如果未找到映射则返回原值
 */
export const getCategoryLabel = (category: string): string => {
    return CATEGORY_LABELS[category] || category;
};

/**
 * 获取品类对应的颜色
 * @param category 品类标识
 * @returns 颜色代码
 */
export const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category] || '#cccccc';
};
