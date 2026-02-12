/**
 * 和风天气 JWT Token 调试工具
 * 
 * 在浏览器控制台使用:
 * import { debugQWeatherToken } from '/src/utils/qweatherDebug.ts';
 * await debugQWeatherToken();
 */

import { generateQWeatherToken } from './qweatherJwt';

export async function debugQWeatherToken() {
    console.log('🔐 和风天气 JWT Token 调试\n');

    // 1. 检查环境变量
    console.log('📋 环境变量:');
    console.log('  KEY_ID:', import.meta.env['VITE_QWEATHER_KEY_ID']);
    console.log('  PROJECT_ID:', import.meta.env['VITE_QWEATHER_PROJECT_ID']);
    console.log('  PRIVATE_KEY:', import.meta.env['VITE_QWEATHER_PRIVATE_KEY'] ? '已配置' : '未配置');
    console.log('  API_HOST:', import.meta.env['VITE_QWEATHER_API_HOST'] || 'devapi.qweather.com (默认)');
    console.log('');

    // 2. 生成 Token
    try {
        console.log('🔑 生成 JWT Token...');
        const token = await generateQWeatherToken();
        console.log('✅ Token 生成成功\n');
        console.log('📝 完整 Token:');
        console.log(token);
        console.log('');

        // 3. 解析 Token
        // 3. 解析 Token
        const [headerB64, payloadB64] = token.split('.');

        if (!headerB64 || !payloadB64) {
            throw new Error('Invalid Token format');
        }

        // Base64URL 解码
        const base64UrlDecode = (str: string) => {
            const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            const padding = '='.repeat((4 - base64.length % 4) % 4);
            return atob(base64 + padding);
        };

        const header = JSON.parse(base64UrlDecode(headerB64));
        const payload = JSON.parse(base64UrlDecode(payloadB64));

        console.log('📄 Token Header:');
        console.log(JSON.stringify(header, null, 2));
        console.log('');

        console.log('📦 Token Payload:');
        console.log(JSON.stringify(payload, null, 2));
        console.log('');

        const now = Math.floor(Date.now() / 1000);
        const timeToExpire = payload.exp - now;
        console.log('⏰ Token 时间信息:');
        console.log(`  签发时间: ${new Date(payload.iat * 1000).toISOString()}`);
        console.log(`  过期时间: ${new Date(payload.exp * 1000).toISOString()}`);
        console.log(`  剩余时间: ${Math.floor(timeToExpire / 60)} 分钟 ${timeToExpire % 60} 秒`);
        console.log('');

        // 4. 测试 API 请求
        console.log('🌐 测试 API 请求...');
        const apiHost = import.meta.env['VITE_QWEATHER_API_HOST'] || 'devapi.qweather.com';
        const testUrl = `https://${apiHost}/v2/city/lookup?location=北京`;

        console.log(`  URL: ${testUrl}`);
        console.log(`  Authorization: Bearer ${token.substring(0, 50)}...`);
        console.log('');

        const response = await fetch(testUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log(`📡 响应状态: ${response.status} ${response.statusText}`);

        const responseText = await response.text();
        console.log('📥 响应内容:');

        try {
            const data = JSON.parse(responseText);
            console.log(JSON.stringify(data, null, 2));

            if (data.code === '200') {
                console.log('\n✅ API 请求成功!');
            } else {
                console.log(`\n❌ API 返回错误码: ${data.code}`);
            }
        } catch {
            console.log(responseText);
            console.log('\n❌ 响应不是有效的 JSON');
        }

    } catch (error) {
        console.error('❌ 调试失败:', error);
    }
}

// 自动导出到 window 对象,方便在控制台调用
if (typeof window !== 'undefined') {
    (window as any).debugQWeatherToken = debugQWeatherToken;
    console.log('💡 提示: 在控制台运行 debugQWeatherToken() 进行调试');
}
