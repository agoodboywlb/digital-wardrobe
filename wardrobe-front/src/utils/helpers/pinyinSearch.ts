export const getPinyinInitials = async (text: string): Promise<string[]> => {
    if (!text || !text.trim()) {return [];}

    // Dynamic import for code splitting
    const { pinyin } = await import('pinyin-pro');

    // Remove whitespace to avoid " " becoming an initial
    // Keep numbers and letters
    const cleanText = text.replace(/\s+/g, '');
    const chars = Array.from(cleanText);

    let combinations: string[] = [''];

    for (const char of chars) {
        let initials: string[] = [];
        const isAlphaNum = /^[a-zA-Z0-9]$/.test(char);

        if (isAlphaNum) {
            initials = [char.toLowerCase()];
        } else {
            // For Chinese char
            // multiple: true ensures we get all readings if ambiguous
            // nonZh: 'consecutive' passes through non-zh just in case
            const pinyinStr = pinyin(char, {
                pattern: 'first',
                toneType: 'none',
                multiple: true,
                nonZh: 'consecutive'
            });

            // pinyin-pro output is space separated for multiple readings
            initials = pinyinStr.split(' ').filter(Boolean).map(s => s.toLowerCase());
        }

        // Deduplicate initials for this char
        initials = Array.from(new Set(initials));

        // Cartesian product with existing combinations
        const nextCombinations: string[] = [];
        for (const prev of combinations) {
            for (const init of initials) {
                nextCombinations.push(prev + init);
            }
        }
        combinations = nextCombinations;

        // Limit combinations count to prevent explosion
        if (combinations.length > 50) {
            combinations = combinations.slice(0, 50);
        }
    }

    // Final dedupe
    return Array.from(new Set(combinations));
};

export const matchPinyin = (indices: string[], query: string): boolean => {
    if (!query) {return true;}
    const q = query.toLowerCase();
    // Test requires prefix match behavior
    return indices.some(index => index.toLowerCase().startsWith(q));
};
