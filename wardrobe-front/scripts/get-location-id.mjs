#!/usr/bin/env node

/**
 * 和风天气 Location ID 查询工具
 * 
 * 用于查询城市的 Location ID
 * 运行: node scripts/get-location-id.mjs [城市名]
 */

import { SignJWT, importPKCS8 } from 'jose';

const KEY_ID = process.env.VITE_QWEATHER_KEY_ID;
const PROJECT_ID = process.env.VITE_QWEATHER_PROJECT_ID;
const PRIVATE_KEY_PEM = process.env.VITE_QWEATHER_PRIVATE_KEY;
const API_HOST = process.env.VITE_QWEATHER_API_HOST || 'devapi.qweather.com';

async function generateToken() {
    const privateKey = await importPKCS8(PRIVATE_KEY_PEM, 'EdDSA');
    const now = Math.floor(Date.now() / 1000);
    const iat = now - 30;
    const exp = iat + 900;

    return await new SignJWT({
        sub: PROJECT_ID,
        iat,
        exp,
    })
        .setProtectedHeader({
            alg: 'EdDSA',
            kid: KEY_ID,
        })
        .sign(privateKey);
}

async function getLocationId(cityName) {
    if (!cityName) {
        console.error('❌ 请提供城市名称');
        console.log('用法: node scripts/get-location-id.mjs [城市名]');
        console.log('示例: node scripts/get-location-id.mjs 北京');
        process.exit(1);
    }

    if (!KEY_ID || !PROJECT_ID || !PRIVATE_KEY_PEM) {
        console.error('❌ 环境变量未配置,请先配置 .env.local');
        process.exit(1);
    }

    try {
        console.log(`🔍 查询城市: ${cityName}\n`);

        const token = await generateToken();
        const url = `https://${API_HOST}/v2/city/lookup?location=${encodeURIComponent(cityName)}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.code === '200' && data.location?.length > 0) {
            console.log('✅ 查询成功\n');
            console.log(`找到 ${data.location.length} 个匹配结果:\n`);

            data.location.forEach((loc, index) => {
                console.log(`${index + 1}. ${loc.name}`);
                console.log(`   Location ID: ${loc.id}`);
                console.log(`   行政区: ${loc.country} / ${loc.adm1} / ${loc.adm2}`);
                console.log(`   经纬度: ${loc.lat}, ${loc.lon}`);
                console.log(`   时区: ${loc.tz}`);
                console.log('');
            });

            console.log('💡 提示: 使用 Location ID 可以更精确地查询天气信息');
        } else {
            console.error('❌ 查询失败');
            console.error(`   状态码: ${response.status}`);
            console.error(`   响应: ${JSON.stringify(data, null, 2)}`);
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ 查询失败:', error.message);
        process.exit(1);
    }
}

// 从命令行参数获取城市名
const cityName = process.argv[2];
getLocationId(cityName);
