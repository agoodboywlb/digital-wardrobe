import { describe, it, expect } from 'vitest';

import { getPinyinInitials, matchPinyin } from '../pinyinSearch';

describe('pinyinSearch', () => {
    describe('getPinyinInitials', () => {
        it('should extract first letters of Chinese characters', async () => {
            // "上装" -> "sz"
            const initials = await getPinyinInitials('上装');
            expect(initials).toContain('sz');
        });

        it('should handle polyphones (e.g., 长 -> c/z)', async () => {
            // "长" -> "c", "z" (approximately)
            const initials = await getPinyinInitials('长');
            // pinyin-pro might return different strings based on implementation, 
            // but let's assume we want at least one common reading.
            // For "长", might get multiple readings.
            expect(initials.some(i => i.startsWith('c') || i.startsWith('z'))).toBe(true);
        });

        it('should handle mixed English/Chinese', async () => {
            // "T恤" -> "tx"
            const initials = await getPinyinInitials('T恤');
            expect(initials).toContain('tx');
            // Note: 'T' is English, '恤' is 'x'. So 'tx'.
        });

        it('should return empty for empty string', async () => {
            const initials = await getPinyinInitials('');
            expect(initials).toEqual([]);
        });
    });

    describe('matchPinyin', () => {
        it('should match prefix case-insensitive', () => {
            expect(matchPinyin(['sz'], 's')).toBe(true);
            expect(matchPinyin(['sz'], 'S')).toBe(true);
            expect(matchPinyin(['sz'], 'sz')).toBe(true);
            expect(matchPinyin(['sz'], 'SZ')).toBe(true);
        });

        it('should fail on partial mismatch (prefix only)', () => {
            expect(matchPinyin(['sz'], 'z')).toBe(false);
        });

        it('should handle array of indices', () => {
            expect(matchPinyin(['cz', 'zz'], 'c')).toBe(true);
            expect(matchPinyin(['cz', 'zz'], 'z')).toBe(true);
            expect(matchPinyin(['cz', 'zz'], 'x')).toBe(false);
        });
    });
});
