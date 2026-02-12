# 🚀 和风天气 JWT 认证快速配置

> 5 分钟快速完成和风天气 JWT 认证配置

## 📋 前置条件

- ✅ 已注册和风天气账号
- ✅ 已创建项目并获取访问权限
- ✅ 已安装 OpenSSL (macOS/Linux 默认已安装)

## 🔧 配置步骤

### Step 1: 生成密钥对 (2 分钟)

```bash
# 1. 创建密钥存储目录
mkdir -p ~/.qweather-keys

# 2. 生成 Ed25519 私钥
openssl genpkey -algorithm ed25519 -out ~/.qweather-keys/ed25519-private.pem

# 3. 生成对应的公钥
openssl pkey -in ~/.qweather-keys/ed25519-private.pem -pubout -out ~/.qweather-keys/ed25519-public.pem

# 4. 查看公钥内容 (稍后需要上传到控制台)
cat ~/.qweather-keys/ed25519-public.pem
```

**输出示例:**
```
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=
-----END PUBLIC KEY-----
```

### Step 2: 上传公钥到和风天气控制台 (1 分钟)

1. 访问 [和风天气控制台 - 项目管理](https://console.qweather.com/project)
2. 选择你的项目
3. 点击 **"添加凭据"** 或 **"管理凭据"**
4. 粘贴上一步生成的公钥内容
5. 保存后,记录下生成的 **凭据 ID (KEY_ID)**

### Step 3: 获取项目信息 (30 秒)

在控制台项目管理页面,记录:
- **项目 ID (PROJECT_ID)**: 通常在项目详情页面显示
- **凭据 ID (KEY_ID)**: 上一步生成的凭据 ID

### Step 4: 配置环境变量 (1 分钟)

编辑项目根目录的 `.env.local` 文件:

```bash
# 1. 打开配置文件
code .env.local  # 或使用你喜欢的编辑器

# 2. 添加以下配置
```

```bash
# 和风天气 JWT 认证配置
VITE_QWEATHER_KEY_ID=你的凭据ID
VITE_QWEATHER_PROJECT_ID=你的项目ID
VITE_QWEATHER_PRIVATE_KEY="$(cat ~/.qweather-keys/ed25519-private.pem)"
VITE_QWEATHER_API_HOST=mg7aar57tm.re.qweatherapi.com
```

**或者手动复制私钥:**

```bash
# 查看私钥内容
cat ~/.qweather-keys/ed25519-private.pem
```

然后在 `.env.local` 中配置:

```bash
VITE_QWEATHER_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIExSpHE6QAZQN+SBdlZom32fcqCcSy0YOlotTiDl4a94
-----END PRIVATE KEY-----"
```

### Step 5: 验证配置 (1 分钟)

```bash
# 1. 加载环境变量
source .env.local

# 2. 运行测试脚本
node scripts/test-qweather-jwt.mjs
```

**成功输出示例:**
```
🔐 和风天气 JWT Token 测试

📋 检查配置...
✅ 配置检查通过

🔑 生成 JWT Token...
✅ Token 生成成功

📝 Token 详情:
   KEY_ID: ABCDE12345
   PROJECT_ID: ABCDE23456
   签发时间 (iat): 2026-02-10T09:57:00.000Z
   过期时间 (exp): 2026-02-10T10:12:00.000Z
   有效期: 15 分钟

🌐 测试 API 请求...
✅ API 请求成功

📍 城市信息:
   城市: 北京
   ID: 101010100
   ...

🎉 所有测试通过!
```

## ✅ 完成!

现在你可以:
1. 重启开发服务器: `npm run dev`
2. 访问智能助手功能,测试天气查询
3. 使用 Location ID 查询工具: `source .env.local && node scripts/get-location-id.mjs 上海`

## 🔍 故障排查

### ❌ "和风天气 JWT 配置缺失"

**原因**: 环境变量未正确加载

**解决**:
```bash
# 1. 检查 .env.local 文件是否存在
ls -la .env.local

# 2. 检查环境变量格式
cat .env.local | grep VITE_QWEATHER

# 3. 重启开发服务器
npm run dev
```

### ❌ "401 Unauthorized"

**原因**: 凭据配置错误或时间不同步

**解决**:
```bash
# 1. 验证配置
source .env.local && node scripts/test-qweather-jwt.mjs

# 2. 检查系统时间
date

# 3. 使用官方验证工具
# 访问: https://console.qweather.com/support/jwt-validation
```

### ❌ "生成 JWT Token 失败"

**原因**: 私钥格式错误

**解决**:
```bash
# 1. 检查私钥格式
cat ~/.qweather-keys/ed25519-private.pem

# 2. 确保包含完整的 PEM 标记
# 应该以 "-----BEGIN PRIVATE KEY-----" 开头
# 以 "-----END PRIVATE KEY-----" 结尾

# 3. 重新生成密钥对
openssl genpkey -algorithm ed25519 -out ~/.qweather-keys/ed25519-private.pem
```

## 📚 更多帮助

- 📖 [详细配置指南](QWEATHER_JWT_SETUP.md)
- 📝 [升级总结文档](migrations/2026-02-10-qweather-jwt-upgrade.md)
- 🌐 [和风天气官方文档](https://dev.qweather.com/docs/configuration/authentication/)

## 🔐 安全提醒

⚠️ **重要**: 私钥是敏感信息,请妥善保管!

- ✅ 已添加到 `.gitignore`
- ❌ 切勿提交到 Git 仓库
- ❌ 切勿分享给他人
- ✅ 定期轮换密钥对
