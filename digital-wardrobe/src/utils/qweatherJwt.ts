import nacl from 'tweetnacl';
import { decodeUTF8, encodeBase64 } from 'tweetnacl-util';

/**
 * 和风天气 JWT Token 生成工具
 * 
 * 根据和风天气官方文档实现:
 * https://dev.qweather.com/docs/configuration/authentication/
 * 
 * 使用 tweetnacl 库实现 Ed25519 签名,确保浏览器兼容性
 */

const KEY_ID = import.meta.env['VITE_QWEATHER_KEY_ID'];
const PROJECT_ID = import.meta.env['VITE_QWEATHER_PROJECT_ID'];
const PRIVATE_KEY_PEM = import.meta.env['VITE_QWEATHER_PRIVATE_KEY'];

// Token 缓存
let cachedToken: string | null = null;
let tokenExpireTime = 0;

/**
 * Base64URL 编码 (符合 JWT 规范)
 */
function base64UrlEncode(str: string): string {
    const base64 = encodeBase64(decodeUTF8(str));
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * 从 PEM 格式提取私钥字节
 */
function parsePEMPrivateKey(pem: string): Uint8Array {
    try {
        // 1. 清理 PEM 格式
        // 移除头部、尾部、换行符和所有空白字符
        const pemContent = pem
            .replace(/-----BEGIN PRIVATE KEY-----/g, '')
            .replace(/-----END PRIVATE KEY-----/g, '')
            .replace(/[\r\n\s]/g, '');

        if (!pemContent) {
            throw new Error('PEM 内容为空');
        }

        // 2. Base64 解码私钥
        // 使用 window.atob 解码 Base64 字符串
        const binaryString = atob(pemContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // 3. 提取 Ed25519 私钥 (32字节)
        // PKCS#8 格式通常为 48 字节: 16 字节头部 + 32 字节私钥
        // 头部特征: 30 2e 02 01 00 30 05 06 03 2b 65 70 04 22 04 20
        if (bytes.length === 48 && bytes[0] === 0x30) {
            return bytes.slice(16, 48);
        }

        // 如果长度是 32 字节，假设已经是原始私钥
        if (bytes.length === 32) {
            return bytes;
        }

        // 如果是其他长度，尝试直接通过 nacl 加载（可能包含公钥）
        // 这里我们抛出更有帮助的错误，打印出长度以便调试
        throw new Error(`无效的私钥长度: ${bytes.length} 字节 (期望 32 或 48 字节)`);

    } catch (error) {
        console.error('私钥解析失败:', error);
        throw new Error(`私钥格式错误: ${error instanceof Error ? error.message : '未知原因'}`);
    }
}

/**
 * 生成和风天气 JWT Token
 * 
 * @param ttlSeconds Token 有效期(秒),默认 900 秒(15分钟),最长 86400 秒(24小时)
 * @returns JWT Token 字符串
 */
export async function generateQWeatherToken(ttlSeconds = 900): Promise<string> {
    // 检查缓存的 Token 是否还有效 (提前 60 秒过期以确保安全)
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && tokenExpireTime > now + 60) {
        return cachedToken;
    }

    // 验证环境变量
    if (!KEY_ID || !PROJECT_ID || !PRIVATE_KEY_PEM) {
        throw new Error(
            '和风天气 JWT 配置缺失。请在 .env.local 中配置:\n' +
            '- VITE_QWEATHER_KEY_ID\n' +
            '- VITE_QWEATHER_PROJECT_ID\n' +
            '- VITE_QWEATHER_PRIVATE_KEY'
        );
    }

    // 验证 TTL 范围
    if (ttlSeconds > 86400) {
        throw new Error('Token 有效期不能超过 24 小时(86400秒)');
    }

    try {
        // 1. 构建 Header
        const header = {
            alg: 'EdDSA',
            kid: KEY_ID,
        };
        const headerEncoded = base64UrlEncode(JSON.stringify(header));

        // 2. 构建 Payload
        const iat = now - 30; // 提前 30 秒,防止时间误差
        const exp = iat + ttlSeconds;
        const payload = {
            sub: PROJECT_ID,
            iat,
            exp,
        };
        const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

        // 3. 准备签名数据
        const signingInput = `${headerEncoded}.${payloadEncoded}`;
        const messageBytes = decodeUTF8(signingInput);

        // 4. 解析私钥
        const privateKeyBytes = parsePEMPrivateKey(PRIVATE_KEY_PEM);

        // 5. 使用 Ed25519 签名
        const keyPair = nacl.sign.keyPair.fromSeed(privateKeyBytes);
        const signature = nacl.sign.detached(messageBytes, keyPair.secretKey);

        // 6. Base64URL 编码签名
        const signatureBase64 = encodeBase64(signature)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        // 7. 拼接完整 Token
        const token = `${signingInput}.${signatureBase64}`;

        // 8. 缓存 Token
        cachedToken = token;
        tokenExpireTime = exp;

        return token;
    } catch (error) {
        console.error('生成和风天气 JWT Token 失败:', error);
        throw new Error(
            '生成 JWT Token 失败: ' +
            (error instanceof Error ? error.message : '未知错误')
        );
    }
}

/**
 * 清除缓存的 Token (用于强制刷新)
 */
export function clearQWeatherTokenCache(): void {
    cachedToken = null;
    tokenExpireTime = 0;
}
