interface TagSource {
    tags?: string[] | null;
}

interface BuildTagRecommendationOptions {
    excludeTags?: string[];
    limit?: number;
}

const SYSTEM_TAG_PREFIX = 'show:';
const DEFAULT_LIMIT = 8;

const normalizeTag = (tag: string): string => tag.trim();
const normalizeTagKey = (tag: string): string => normalizeTag(tag).toLocaleLowerCase();

export const parseCustomTags = (input: string): string[] => {
    const segments = input.split(/[,，]/);
    const unique = new Set<string>();
    const parsed: string[] = [];

    segments.forEach((segment) => {
        const tag = normalizeTag(segment);
        if (!tag || tag.startsWith(SYSTEM_TAG_PREFIX)) {
            return;
        }

        const key = normalizeTagKey(tag);
        if (unique.has(key)) {
            return;
        }

        unique.add(key);
        parsed.push(tag);
    });

    return parsed;
};

export const mergeTagIntoInput = (input: string, nextTag: string): string => {
    const merged = [...parseCustomTags(input)];
    const existingKeys = new Set(merged.map(normalizeTagKey));

    parseCustomTags(nextTag).forEach((tag) => {
        const key = normalizeTagKey(tag);
        if (existingKeys.has(key)) {
            return;
        }

        existingKeys.add(key);
        merged.push(tag);
    });

    return merged.join('，');
};

export const buildTagRecommendations = (
    items: TagSource[],
    options: BuildTagRecommendationOptions = {}
): string[] => {
    const limit = options.limit ?? DEFAULT_LIMIT;
    if (limit <= 0) {
        return [];
    }

    const excludedKeys = new Set((options.excludeTags || []).map(normalizeTagKey));
    const stats = new Map<string, { label: string; count: number; firstSeen: number }>();
    let index = 0;

    items.forEach((item) => {
        (item.tags || []).forEach((rawTag) => {
            const tag = normalizeTag(rawTag);
            if (!tag || tag.startsWith(SYSTEM_TAG_PREFIX)) {
                return;
            }

            const key = normalizeTagKey(tag);
            if (excludedKeys.has(key)) {
                return;
            }

            const current = stats.get(key);
            if (current) {
                current.count += 1;
                return;
            }

            stats.set(key, { label: tag, count: 1, firstSeen: index });
            index += 1;
        });
    });

    return [...stats.values()]
        .sort((a, b) => {
            if (b.count !== a.count) {
                return b.count - a.count;
            }
            return a.firstSeen - b.firstSeen;
        })
        .slice(0, limit)
        .map((entry) => entry.label);
};
