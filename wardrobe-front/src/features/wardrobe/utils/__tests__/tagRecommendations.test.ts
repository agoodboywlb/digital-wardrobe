import { describe, expect, it } from 'vitest';

import { buildTagRecommendations, mergeTagIntoInput, parseCustomTags } from '../tagRecommendations';

describe('tagRecommendations', () => {
    describe('parseCustomTags', () => {
        it('parses comma and Chinese comma separated tags', () => {
            expect(parseCustomTags(' 通勤, 复古，日常 , ,')).toEqual(['通勤', '复古', '日常']);
        });

        it('deduplicates tags case-insensitively while preserving first occurrence', () => {
            expect(parseCustomTags('Casual, casual, CASUAL,  通勤  ,通勤')).toEqual(['Casual', '通勤']);
        });
    });

    describe('mergeTagIntoInput', () => {
        it('appends a new tag with Chinese comma separator', () => {
            expect(mergeTagIntoInput('通勤', '复古')).toBe('通勤，复古');
        });

        it('does not append duplicated tags', () => {
            expect(mergeTagIntoInput('通勤，复古', '通勤')).toBe('通勤，复古');
        });
    });

    describe('buildTagRecommendations', () => {
        it('filters system tags and sorts by frequency', () => {
            const recommended = buildTagRecommendations(
                [
                    { tags: ['show:brand', '通勤', '休闲'] },
                    { tags: ['通勤', ' 复古 '] },
                    { tags: ['show:size', '复古', '通勤'] },
                ],
                {
                    excludeTags: ['复古'],
                    limit: 5,
                }
            );

            expect(recommended).toEqual(['通勤', '休闲']);
        });

        it('returns empty array when there is no valid custom tag', () => {
            const recommended = buildTagRecommendations([{ tags: ['show:brand'] }, { tags: [] }]);
            expect(recommended).toEqual([]);
        });
    });
});
