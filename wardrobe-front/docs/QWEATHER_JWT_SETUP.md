# 和风天气 JWT 认证配置指南

## 概述

本项目已升级为使用和风天气的 **JWT (JSON Web Token)** 认证方式,相比 API Key 更加安全。

## 配置步骤

### 1. 获取认证信息

登录 [和风天气控制台](https://console.qweather.com/project),在**项目管理**页面获取:

- **凭据 ID (KEY_ID)**: 用于 JWT Header 的 `kid` 字段
- **项目 ID (PROJECT_ID)**: 用于 JWT Payload 的 `sub` 字段
- **Ed25519 私钥**: 用于签名 JWT Token

### 2. 生成 Ed25519 密钥对

如果还没有密钥对,使用 OpenSSL 生成:

```bash
# 生成私钥
openssl genpkey -algorithm ed25519 -out ed25519-private.pem

# 生成公钥
openssl pkey -in ed25519-private.pem -pubout -out ed25519-public.pem
```

### 3. 上传公钥到和风天气控制台

1. 复制 `ed25519-public.pem` 的内容
2. 在控制台的项目管理页面上传公钥
3. 获取生成的 **凭据 ID (KEY_ID)**

### 4. 配置环境变量

在项目根目录的 `.env.local` 文件中配置:

```bash
# 和风天气 JWT 认证配置
# 凭据 ID (在控制台-项目管理中查看)
VITE_QWEATHER_KEY_ID=your_key_id_here

# 项目 ID (在控制台-项目管理中查看)
VITE_QWEATHER_PROJECT_ID=your_project_id_here

# Ed25519 私钥 (完整的 PEM 格式,包含 BEGIN/END 标记)
VITE_QWEATHER_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIExSpHE6QAZQN+SBdlZom32fcqCcSy0YOlotTiDl4a94
-----END PRIVATE KEY-----"

# API Host (可选,默认为 devapi.qweather.com)
VITE_QWEATHER_API_HOST=mg7aar57tm.re.qweatherapi.com
```

**注意事项:**
- 私钥必须包含完整的 PEM 格式标记 (`-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`)
- 私钥内容可以是单行或多行,工具会自动处理
- 私钥是敏感信息,**切勿提交到 Git 仓库**

### 5. 验证配置

重启开发服务器后,访问智能助手功能,系统会自动:
1. 使用私钥生成 JWT Token
2. 在请求头中添加 `Authorization: Bearer <token>`
3. 缓存 Token (默认 15 分钟有效期)

## JWT Token 生成逻辑

### Token 结构

```
Header.Payload.Signature
```

#### Header
```json
{
  "alg": "EdDSA",
  "kid": "YOUR_KEY_ID"
}
```

#### Payload
```json
{
  "sub": "YOUR_PROJECT_ID",
  "iat": 1703912400,  // 签发时间 (当前时间 - 30秒)
  "exp": 1703912940   // 过期时间 (iat + 900秒)
}
```

#### Signature
使用 Ed25519 算法对 `Base64URL(Header).Base64URL(Payload)` 进行签名

### Token 缓存策略

- **默认有效期**: 900 秒 (15 分钟)
- **最长有效期**: 86400 秒 (24 小时)
- **缓存机制**: Token 在过期前 60 秒会自动刷新
- **手动清除**: 调用 `clearQWeatherTokenCache()` 强制刷新

## API 请求示例

### 获取城市信息
```bash
curl -X GET --compressed \
  -H 'Authorization: Bearer <your_jwt_token>' \
  'https://mg7aar57tm.re.qweatherapi.com/v2/city/lookup?location=北京'
```

### 获取实时天气
```bash
curl -X GET --compressed \
  -H 'Authorization: Bearer <your_jwt_token>' \
  'https://mg7aar57tm.re.qweatherapi.com/v7/weather/now?location=101010100'
```

## 故障排查

### 401 Unauthorized 错误

1. **检查凭据配置**: 确认 `KEY_ID` 和 `PROJECT_ID` 正确
2. **验证私钥格式**: 确保私钥包含完整的 PEM 标记
3. **时间同步**: 确保系统时间准确 (JWT 使用时间戳验证)
4. **使用官方验证工具**: [和风天气 JWT 验证](https://console.qweather.com/support/jwt-validation)

### Token 生成失败

检查浏览器控制台错误信息:
- `和风天气 JWT 配置缺失`: 环境变量未配置
- `Token 有效期不能超过 24 小时`: TTL 参数超过限制
- `生成 JWT Token 失败`: 私钥格式错误或算法不支持

### 城市查询失败

- 确认 API Host 配置正确
- 检查网络连接
- 查看浏览器控制台的详细错误信息

## 安全建议

1. **私钥保护**: 
   - 切勿将私钥提交到 Git 仓库
   - 在 `.gitignore` 中添加 `.env.local`
   - 定期轮换密钥对

2. **Token 有效期**:
   - 前端建议使用较短的有效期 (15-30 分钟)
   - 服务端可以使用较长的有效期 (1-24 小时)

3. **HTTPS 传输**:
   - 生产环境必须使用 HTTPS
   - 防止 Token 在传输过程中被截获

## 参考文档

- [和风天气身份认证文档](https://dev.qweather.com/docs/configuration/authentication/)
- [JWT 官方规范 (RFC 7519)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Ed25519 签名算法](https://ed25519.cr.yp.to/)
