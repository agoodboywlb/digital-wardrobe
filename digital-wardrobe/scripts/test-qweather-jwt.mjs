#!/usr/bin/env node

/**
 * 和风天气 JWT Token 测试脚本
 * 
 * 用于验证 JWT Token 生成是否正常
 * 运行: node scripts/test-qweather-jwt.mjs
 */

import { SignJWT, importPKCS8 } from 'jose';

// 从环境变量读取配置
const KEY_ID = process.env.VITE_QWEATHER_KEY_ID;
const PROJECT_ID = process.env.VITE_QWEATHER_PROJECT_ID;
const PRIVATE_KEY_PEM = process.env.VITE_QWEATHER_PRIVATE_KEY;
const API_HOST = process.env.VITE_QWEATHER_API_HOST || 'devapi.qweather.com';

async function testJwtGeneration() {
    console.log('🔐 和风天气 JWT Token 测试\n');

    // 1. 检查配置
    console.log('📋 检查配置...');
    if (!KEY_ID) {
        console.error('❌ VITE_QWEATHER_KEY_ID 未配置');
        process.exit(1);
    }
    if (!PROJECT_ID) {
        console.error('❌ VITE_QWEATHER_PROJECT_ID 未配置');
        process.exit(1);
    }
    if (!PRIVATE_KEY_PEM) {
        console.error('❌ VITE_QWEATHER_PRIVATE_KEY 未配置');
        process.exit(1);
    }
    console.log('✅ 配置检查通过\n');

    // 2. 生成 JWT Token
    console.log('🔑 生成 JWT Token...');
    try {
        const privateKey = await importPKCS8(PRIVATE_KEY_PEM, 'EdDSA');

        const now = Math.floor(Date.now() / 1000);
        const iat = now - 30;
        const exp = iat + 900;

        const token = await new SignJWT({
            sub: PROJECT_ID,
            iat,
            exp,
        })
            .setProtectedHeader({
                alg: 'EdDSA',
                kid: KEY_ID,
            })
            .sign(privateKey);

        console.log('✅ Token 生成成功\n');
        console.log('📝 Token 详情:');
        console.log(`   KEY_ID: ${KEY_ID}`);
        console.log(`   PROJECT_ID: ${PROJECT_ID}`);
        console.log(`   签发时间 (iat): ${new Date(iat * 1000).toISOString()}`);
        console.log(`   过期时间 (exp): ${new Date(exp * 1000).toISOString()}`);
        console.log(`   有效期: ${(exp - iat) / 60} 分钟\n`);
        console.log('🎫 完整 Token:');
        console.log(token);
        console.log('');

        // 3. 测试 API 请求
        console.log('🌐 测试 API 请求...');
        const testCity = '北京';
        const geoUrl = `https://${API_HOST}/v2/city/lookup?location=${encodeURIComponent(testCity)}`;

        console.log(`   请求 URL: ${geoUrl}`);
        const response = await fetch(geoUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.code === '200') {
            console.log('✅ API 请求成功\n');
            console.log('📍 城市信息:');
            const location = data.location[0];
            console.log(`   城市: ${location.name}`);
            console.log(`   ID: ${location.id}`);
            console.log(`   经纬度: ${location.lat}, ${location.lon}`);
            console.log(`   行政区: ${location.adm1} / ${location.adm2}`);
            console.log('');

            // 4. 测试天气查询
            console.log('🌤️  测试天气查询...');
            const weatherUrl = `https://${API_HOST}/v7/weather/now?location=${location.id}`;
            console.log(`   请求 URL: ${weatherUrl}`);

            const weatherResponse = await fetch(weatherUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const weatherData = await weatherResponse.json();

            if (weatherResponse.ok && weatherData.code === '200') {
                console.log('✅ 天气查询成功\n');
                console.log('🌡️  天气信息:');
                console.log(`   温度: ${weatherData.now.temp}°C`);
                console.log(`   天气: ${weatherData.now.text}`);
                console.log(`   体感温度: ${weatherData.now.feelsLike}°C`);
                console.log(`   湿度: ${weatherData.now.humidity}%`);
                console.log(`   风向: ${weatherData.now.windDir}`);
                console.log(`   风速: ${weatherData.now.windSpeed} km/h`);
                console.log(`   更新时间: ${weatherData.updateTime}`);
                console.log('');
                console.log('🎉 所有测试通过!');
            } else {
                console.error('❌ 天气查询失败');
                console.error(`   状态码: ${weatherResponse.status}`);
                console.error(`   响应: ${JSON.stringify(weatherData, null, 2)}`);
                process.exit(1);
            }
        } else {
            console.error('❌ API 请求失败');
            console.error(`   状态码: ${response.status}`);
            console.error(`   响应: ${JSON.stringify(data, null, 2)}`);
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// 运行测试
testJwtGeneration();
