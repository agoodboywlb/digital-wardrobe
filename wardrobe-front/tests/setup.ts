import '@testing-library/jest-dom';
import { beforeAll, afterEach } from 'vitest';

// 全局测试设置
beforeAll(() => {
    // 模拟环境变量
    process.env['VITE_SUPABASE_URL'] = 'https://test.supabase.co';
    process.env['VITE_SUPABASE_ANON_KEY'] = 'test-key';
});

afterEach(() => {
    // 清理
});
