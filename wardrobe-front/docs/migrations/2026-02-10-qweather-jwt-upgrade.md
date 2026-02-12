# 和风天气 JWT 认证升级总结

## 📋 改动概览

本次升级将和风天气 API 认证方式从 **API Key** 改为更安全的 **JWT Token** 认证。

### 升级日期
2026-02-10

### 主要改动

#### 1. 依赖安装
- ✅ 安装 `jose` 库用于 JWT Token 生成

#### 2. 环境变量更新
**移除:**
- `VITE_QWEATHER_KEY` (旧的 API Key)

**新增:**
- `VITE_QWEATHER_KEY_ID` - 凭据 ID (必需)
- `VITE_QWEATHER_PROJECT_ID` - 项目 ID (必需)
- `VITE_QWEATHER_PRIVATE_KEY` - Ed25519 私钥 (必需)
- `VITE_QWEATHER_API_HOST` - API Host (可选,默认 devapi.qweather.com)

#### 3. 新增文件

| 文件路径 | 说明 |
|---------|------|
| `src/utils/qweatherJwt.ts` | JWT Token 生成工具 |
| `docs/QWEATHER_JWT_SETUP.md` | 详细配置指南 |
| `scripts/test-qweather-jwt.mjs` | JWT 认证测试脚本 |
| `scripts/get-location-id.mjs` | Location ID 查询工具 |
| `.env.local.example` | 环境变量示例文件 |

#### 4. 修改文件

| 文件路径 | 改动说明 |
|---------|---------|
| `.env.local` | 更新为 JWT 认证配置 |
| `src/features/assistant/services/weatherService.ts` | 使用 JWT Token 替代 API Key |
| `README.md` | 添加 JWT 认证配置说明 |

## 🔑 JWT Token 生成逻辑

### Token 结构
```
Header.Payload.Signature
```

### 实现细节

1. **Header**
   - `alg`: EdDSA (Ed25519 签名算法)
   - `kid`: 凭据 ID

2. **Payload**
   - `sub`: 项目 ID
   - `iat`: 签发时间 (当前时间 - 30秒,防止时间误差)
   - `exp`: 过期时间 (iat + 900秒,默认 15 分钟)

3. **Signature**
   - 使用 Ed25519 私钥对 `Base64URL(Header).Base64URL(Payload)` 进行签名

### Token 缓存策略

- **自动缓存**: Token 在过期前 60 秒会自动刷新
- **默认有效期**: 900 秒 (15 分钟)
- **最长有效期**: 86400 秒 (24 小时)

## 🔄 API 请求变化

### 之前 (API Key)
```typescript
const url = `https://${API_HOST}/v2/city/lookup?location=${city}&key=${API_KEY}`;
const response = await fetch(url);
```

### 现在 (JWT Token)
```typescript
const token = await generateQWeatherToken();
const url = `https://${API_HOST}/v2/city/lookup?location=${encodeURIComponent(city)}`;
const response = await fetch(url, {
    headers: {
        'Authorization': `Bearer ${token}`,
    },
});
```

## 📝 配置步骤

### 1. 获取认证信息
1. 登录 [和风天气控制台](https://console.qweather.com/project)
2. 在项目管理页面获取 **凭据 ID** 和 **项目 ID**

### 2. 生成密钥对
```bash
# 生成私钥
openssl genpkey -algorithm ed25519 -out ed25519-private.pem

# 生成公钥
openssl pkey -in ed25519-private.pem -pubout -out ed25519-public.pem
```

### 3. 上传公钥
1. 复制 `ed25519-public.pem` 内容
2. 在控制台上传公钥
3. 获取生成的凭据 ID

### 4. 配置环境变量
编辑 `.env.local`:
```bash
VITE_QWEATHER_KEY_ID=your_key_id_here
VITE_QWEATHER_PROJECT_ID=your_project_id_here
VITE_QWEATHER_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_content_here
-----END PRIVATE KEY-----"
VITE_QWEATHER_API_HOST=mg7aar57tm.re.qweatherapi.com
```

### 5. 测试配置
```bash
# 测试 JWT Token 生成和 API 请求
source .env.local && node scripts/test-qweather-jwt.mjs

# 查询城市 Location ID
source .env.local && node scripts/get-location-id.mjs 北京
```

## ✅ 验证清单

- [ ] 安装 `jose` 依赖
- [ ] 配置环境变量 (KEY_ID, PROJECT_ID, PRIVATE_KEY)
- [ ] 运行测试脚本验证配置
- [ ] 重启开发服务器
- [ ] 测试智能助手天气功能

## 🔒 安全建议

1. **私钥保护**
   - ✅ `.env.local` 已在 `.gitignore` 中
   - ❌ 切勿将私钥提交到 Git 仓库
   - ⚠️ 定期轮换密钥对

2. **Token 有效期**
   - 前端: 15-30 分钟 (当前默认 15 分钟)
   - 服务端: 可延长至 1-24 小时

3. **HTTPS 传输**
   - 生产环境必须使用 HTTPS
   - 防止 Token 被中间人攻击截获

## 📚 参考文档

- [和风天气身份认证文档](https://dev.qweather.com/docs/configuration/authentication/)
- [JWT 官方规范 (RFC 7519)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Ed25519 签名算法](https://ed25519.cr.yp.to/)
- [jose 库文档](https://github.com/panva/jose)

## 🐛 故障排查

### 常见问题

1. **401 Unauthorized**
   - 检查 KEY_ID 和 PROJECT_ID 是否正确
   - 验证私钥格式是否完整
   - 确认系统时间准确

2. **Token 生成失败**
   - 检查私钥是否包含完整的 PEM 标记
   - 确认 `jose` 库已正确安装

3. **城市查询失败**
   - 检查 API_HOST 配置
   - 查看浏览器控制台错误信息
   - 使用测试脚本验证配置

### 调试工具

- **JWT 验证**: https://console.qweather.com/support/jwt-validation
- **测试脚本**: `scripts/test-qweather-jwt.mjs`
- **Location ID 查询**: `scripts/get-location-id.mjs`

## 📞 支持

如有问题,请:
1. 查看 `docs/QWEATHER_JWT_SETUP.md` 详细配置指南
2. 运行测试脚本诊断问题
3. 查看和风天气官方文档
4. 提交 Issue 到项目仓库
