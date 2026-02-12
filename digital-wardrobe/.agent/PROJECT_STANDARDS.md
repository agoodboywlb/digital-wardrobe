# Digital Wardrobe 项目开发规范

> **版本**: 1.0.0  
> **最后更新**: 2026-02-09  
> **适用范围**: 所有项目贡献者

---

## 📋 目录

1. [项目架构](#项目架构)
2. [代码规范](#代码规范)
3. [TypeScript 规范](#typescript-规范)
4. [React 组件规范](#react-组件规范)
5. [状态管理规范](#状态管理规范)
6. [API 与数据层规范](#api-与数据层规范)
7. [样式规范](#样式规范)
8. [测试规范](#测试规范)
9. [Git 工作流](#git-工作流)
10. [性能优化](#性能优化)
11. [安全规范](#安全规范)
12. [文档规范](#文档规范)

---

## 🏗️ 项目架构

### 目录结构

```
digital-wardrobe/
├── .agent/                    # AI Agent 配置和规范
│   ├── PROJECT_STANDARDS.md  # 本文档
│   └── workflows/             # 工作流定义
├── supabase/                  # 数据库相关
│   ├── migrations/            # 数据库迁移脚本 (生产)
│   └── scripts/               # 开发辅助脚本 (调试/权限放通)
├── src/                       # 源代码目录
│   ├── assets/                # 静态资源
│   │   ├── images/
│   │   └── fonts/
│   ├── components/            # 通用组件
│   │   ├── common/            # 基础组件 (Button, Input, etc.)
│   │   ├── layout/            # 布局组件 (Header, Footer, etc.)
│   │   └── index.ts           # 统一导出
│   ├── features/              # 功能模块 (Feature-based)
│   │   ├── wardrobe/
│   │   │   ├── components/    # 功能专属组件
│   │   │   ├── hooks/         # 功能专属 Hooks
│   │   │   ├── services/      # 功能专属服务
│   │   │   ├── types/         # 功能专属类型
│   │   │   └── index.ts
│   │   ├── outfit/
│   │   ├── stats/
│   │   └── settings/
│   ├── hooks/                 # 全局自定义 Hooks
│   ├── lib/                   # 第三方库配置
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/                 # 页面组件 (路由级别)
│   ├── services/              # 全局服务层
│   │   ├── api/               # API 调用
│   │   ├── storage/           # 本地存储
│   │   └── analytics/         # 数据分析
│   ├── styles/                # 全局样式
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── themes/
│   ├── types/                 # 全局类型定义
│   │   ├── models/            # 数据模型
│   │   ├── api/               # API 类型
│   │   └── index.ts
│   ├── utils/                 # 工具函数
│   │   ├── formatters/        # 格式化工具
│   │   ├── validators/        # 验证工具
│   │   └── helpers/           # 辅助函数
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/                    # 公共静态资源
├── tests/                     # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example               # 环境变量示例
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc                # Prettier 配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── package.json
```

### 架构原则

1. **单一职责原则 (SRP)**: 每个模块/组件只负责一个功能
2. **开闭原则 (OCP)**: 对扩展开放,对修改关闭
3. **依赖倒置原则 (DIP)**: 依赖抽象而非具体实现
4. **关注点分离**: UI、业务逻辑、数据层严格分离

---

## 📝 代码规范

### 命名规范

#### 文件命名

```typescript
// ✅ 推荐
// 组件: PascalCase
UserProfile.tsx
WardrobeList.tsx

// 工具函数/服务: camelCase
formatDate.ts
wardrobeService.ts

// 类型定义: PascalCase
ClothingItem.ts
ApiResponse.ts

// 常量: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
DEFAULT_CONFIG.ts

// Hooks: camelCase with 'use' prefix
useAuth.ts
useWardrobe.ts
```

#### 变量命名

```typescript
// ✅ 推荐
const userName = 'John';
const isLoading = false;
const MAX_RETRY_COUNT = 3;

// ❌ 避免
const x = 'John';
const flag = false;
const max = 3;
```

#### 函数命名

```typescript
// ✅ 推荐 - 动词开头,语义明确
function fetchUserData() {}
function handleSubmit() {}
function validateEmail() {}
function isAuthenticated() {}

// ❌ 避免
function data() {}
function submit() {}
function email() {}
function auth() {}
```

### 代码格式化

使用 **Prettier** 自动格式化:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### 注释规范

```typescript
/**
 * 获取用户衣橱数据
 * @param userId - 用户ID
 * @param options - 查询选项
 * @returns Promise<ClothingItem[]> 衣橱物品列表
 * @throws {ApiError} 当API调用失败时抛出
 * 
 * @example
 * ```typescript
 * const items = await fetchWardrobeItems('user-123', { category: 'tops' });
 * ```
 */
async function fetchWardrobeItems(
  userId: string,
  options?: FetchOptions
): Promise<ClothingItem[]> {
  // 实现...
}
```

---

## 🔷 TypeScript 规范

### 类型定义

```typescript
// ✅ 推荐 - 使用 interface 定义对象结构
interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  imageUrl: string;
  createdAt: Date;
}

// ✅ 推荐 - 使用 type 定义联合类型/工具类型
type Category = 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';
type Nullable<T> = T | null;

// ✅ 推荐 - 使用 enum 定义固定常量集合
enum ItemStatus {
  InWardrobe = 'in_wardrobe',
  ToWash = 'to_wash',
  AtTailor = 'at_tailor',
  DryCleaning = 'dry_cleaning',
}
```

### 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 类型守卫

```typescript
// ✅ 推荐 - 使用类型守卫
function isClothingItem(item: unknown): item is ClothingItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'category' in item
  );
}

// 使用
if (isClothingItem(data)) {
  console.log(data.name); // TypeScript 知道 data 是 ClothingItem
}
```

### 避免 any

```typescript
// ❌ 避免
function processData(data: any) {
  return data.value;
}

// ✅ 推荐
function processData<T extends { value: unknown }>(data: T) {
  return data.value;
}

// 或使用 unknown
function processData(data: unknown) {
  if (isValidData(data)) {
    return data.value;
  }
  throw new Error('Invalid data');
}
```

---

## ⚛️ React 组件规范

### 组件结构

```typescript
/**
 * 衣橱列表组件
 * 
 * @component
 * @example
 * ```tsx
 * <WardrobeList 
 *   items={items} 
 *   onItemClick={handleClick}
 *   loading={isLoading}
 * />
 * ```
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ClothingItem } from '@/types';
import { useWardrobe } from '@/hooks/useWardrobe';

// 1. 类型定义
interface WardrobeListProps {
  items: ClothingItem[];
  onItemClick?: (item: ClothingItem) => void;
  loading?: boolean;
  className?: string;
}

// 2. 组件定义
export const WardrobeList: React.FC<WardrobeListProps> = ({
  items,
  onItemClick,
  loading = false,
  className = '',
}) => {
  // 3. Hooks (按顺序: state, effect, custom hooks)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { filterItems } = useWardrobe();

  // 4. 计算值 (useMemo)
  const filteredItems = useMemo(() => {
    return filterItems(items);
  }, [items, filterItems]);

  // 5. 事件处理器 (useCallback)
  const handleItemClick = useCallback(
    (item: ClothingItem) => {
      setSelectedId(item.id);
      onItemClick?.(item);
    },
    [onItemClick]
  );

  // 6. 副作用 (useEffect)
  useEffect(() => {
    // 组件挂载时的逻辑
    return () => {
      // 清理逻辑
    };
  }, []);

  // 7. 条件渲染
  if (loading) {
    return <LoadingSpinner />;
  }

  if (filteredItems.length === 0) {
    return <EmptyState />;
  }

  // 8. 主渲染
  return (
    <div className={`wardrobe-list ${className}`}>
      {filteredItems.map((item) => (
        <WardrobeItem
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
};

// 9. 默认导出 (可选)
export default WardrobeList;
```

### 组件拆分原则

```typescript
// ❌ 避免 - 单个组件过大
function WardrobePage() {
  // 500+ 行代码...
}

// ✅ 推荐 - 拆分为多个小组件
function WardrobePage() {
  return (
    <div>
      <WardrobeHeader />
      <WardrobeFilters />
      <WardrobeList />
      <WardrobeFooter />
    </div>
  );
}
```

### Props 设计

```typescript
// ✅ 推荐 - 明确的 Props 类型
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

// ✅ 推荐 - 使用默认值
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
}) => {
  // ...
};
```

---

## 🔄 状态管理规范

### 本地状态 (useState)

```typescript
// ✅ 推荐 - 简单的 UI 状态
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

// ✅ 推荐 - 复杂状态使用 useReducer
type State = {
  items: ClothingItem[];
  loading: boolean;
  error: Error | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ClothingItem[] }
  | { type: 'FETCH_ERROR'; payload: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
```

### 自定义 Hooks

```typescript
/**
 * 衣橱数据管理 Hook
 * 
 * @returns 衣橱数据和操作方法
 * 
 * @example
 * ```tsx
 * const { items, loading, error, addItem, deleteItem } = useWardrobe();
 * ```
 */
export function useWardrobe() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchItems = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const items = await wardrobeService.fetchItems();
      dispatch({ type: 'FETCH_SUCCESS', payload: items });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error as Error });
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    refetch: fetchItems,
  };
}
```

---

## 🌐 API 与数据层规范

### Service 层设计

```typescript
/**
 * 衣橱服务层
 * 负责所有与衣橱相关的数据操作
 */

import { supabase } from '@/lib/supabase';
import { ClothingItem, CreateItemDTO, UpdateItemDTO } from '@/types';
import { handleApiError, ApiError } from '@/utils/errorHandler';

export class WardrobeService {
  /**
   * 获取所有衣橱物品
   * @throws {ApiError} 当API调用失败时
   */
  async fetchItems(): Promise<ClothingItem[]> {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.mapToClothingItem);
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch wardrobe items');
    }
  }

  /**
   * 添加新物品
   * @param item - 物品数据
   * @returns 创建的物品
   * @throws {ApiError} 当创建失败时
   */
  async addItem(item: CreateItemDTO): Promise<ClothingItem> {
    try {
      const dbItem = this.mapToDbItem(item);

      const { data, error } = await supabase
        .from('items')
        .insert(dbItem)
        .select()
        .single();

      if (error) throw error;

      return this.mapToClothingItem(data);
    } catch (error) {
      throw handleApiError(error, 'Failed to add item');
    }
  }

  /**
   * 数据库行映射到前端模型
   */
  private mapToClothingItem(row: ItemDB): ClothingItem {
    return {
      id: row.id,
      name: row.name,
      category: row.category as Category,
      subCategory: row.sub_category ?? undefined,
      imageUrl: row.image_url ?? '',
      brand: row.brand ?? undefined,
      size: row.size ?? undefined,
      material: row.material ?? undefined,
      purchaseDate: row.purchase_date ?? undefined,
      lastWorn: row.last_worn ?? undefined,
      status: row.status as ItemStatus,
      tags: row.tags ?? [],
      price: row.price ?? undefined,
      cpw: row.cpw ?? undefined,
      wearCount: row.wear_count ?? 0,
    };
  }

  /**
   * 前端模型映射到数据库行
   */
  private mapToDbItem(item: CreateItemDTO): NewItemDB {
    return {
      name: item.name,
      category: item.category,
      sub_category: item.subCategory,
      image_url: item.imageUrl,
      brand: item.brand,
      size: item.size,
      material: item.material,
      purchase_date: item.purchaseDate,
      last_worn: item.lastWorn,
      status: item.status,
      tags: item.tags,
      price: item.price,
      cpw: item.cpw,
      wear_count: item.wearCount,
    };
  }
}

// 导出单例
export const wardrobeService = new WardrobeService();
```

### 错误处理

```typescript
/**
 * 统一错误处理
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown, context: string): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(
      `${context}: ${error.message}`,
      'UNKNOWN_ERROR',
      undefined,
      error
    );
  }

  return new ApiError(
    `${context}: Unknown error occurred`,
    'UNKNOWN_ERROR',
    undefined,
    error
  );
}

// 使用示例
try {
  await wardrobeService.fetchItems();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error [${error.code}]:`, error.message);
    // 显示用户友好的错误消息
    showToast(getErrorMessage(error.code));
  }
}
```

---

## 🎨 样式规范

### CSS 组织

```css
/* globals.css */

/* 1. CSS Reset/Normalize */
@import 'normalize.css';

/* 2. CSS Variables */
:root {
  /* Colors */
  --color-primary: #fac638;
  --color-primary-dark: #e0b030;
  --color-background-light: #f8f9fa;
  --color-background-dark: #0f0f0f;
  --color-text-main: #1a1a1a;
  --color-text-secondary: #6b7280;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}

/* 3. Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background-light: #1a1a1a;
    --color-background-dark: #0f0f0f;
    --color-text-main: #ffffff;
    --color-text-secondary: #9ca3af;
  }
}

/* 4. Utility Classes */
.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 组件样式

```typescript
// ✅ 推荐 - 使用 CSS Modules 或 Tailwind
import styles from './Button.module.css';

export const Button: React.FC<ButtonProps> = ({ children, variant }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
};

// 或使用 Tailwind (如果项目采用)
export const Button: React.FC<ButtonProps> = ({ children, variant }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-text-main hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};
```

---

## 🧪 测试规范

### 单元测试

```typescript
// WardrobeList.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WardrobeList } from './WardrobeList';

describe('WardrobeList', () => {
  const mockItems = [
    {
      id: '1',
      name: 'White T-Shirt',
      category: 'tops',
      imageUrl: 'https://example.com/image.jpg',
      status: 'in_wardrobe',
      tags: [],
    },
  ];

  it('renders items correctly', () => {
    render(<WardrobeList items={mockItems} />);
    expect(screen.getByText('White T-Shirt')).toBeInTheDocument();
  });

  it('calls onItemClick when item is clicked', () => {
    const handleClick = vi.fn();
    render(<WardrobeList items={mockItems} onItemClick={handleClick} />);

    fireEvent.click(screen.getByText('White T-Shirt'));
    expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('shows loading state', () => {
    render(<WardrobeList items={[]} loading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<WardrobeList items={[]} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });
});
```

### 集成测试

```typescript
// wardrobeService.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { wardrobeService } from './wardrobeService';
import { supabase } from '@/lib/supabase';

describe('WardrobeService', () => {
  beforeEach(async () => {
    // 清理测试数据
    await supabase.from('items').delete().neq('id', '');
  });

  afterEach(async () => {
    // 清理
  });

  it('fetches items successfully', async () => {
    const items = await wardrobeService.fetchItems();
    expect(Array.isArray(items)).toBe(true);
  });

  it('adds item successfully', async () => {
    const newItem = {
      name: 'Test Item',
      category: 'tops',
      imageUrl: 'https://example.com/test.jpg',
      status: 'in_wardrobe',
      tags: [],
    };

    const created = await wardrobeService.addItem(newItem);
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Test Item');
  });
});
```

---

## 🔀 Git 工作流

### Commit 规范 (Conventional Commits)

```bash
# 格式
<type>(<scope>): <subject>

<body>

<footer>

# 类型 (type)
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式调整 (不影响功能)
refactor: 重构 (既不是新功能也不是修复)
perf:     性能优化
test:     测试相关
chore:    构建/工具链更新
ci:       CI/CD 配置

# 示例
feat(wardrobe): add filter by category
fix(outfit): resolve image upload error
docs(readme): update installation guide
refactor(services): extract common API logic
perf(wardrobe): optimize item rendering with virtualization
```

### 分支策略

```bash
# 主分支
main          # 生产环境代码
develop       # 开发环境代码

# 功能分支
feature/wardrobe-filter
feature/outfit-planner

# 修复分支
fix/image-upload-error
hotfix/critical-bug

# 发布分支
release/v1.0.0
```

### Pull Request 规范

```markdown
## 📝 变更说明
简要描述本次 PR 的目的和内容

## 🔗 关联 Issue
Closes #123

## ✅ 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档更新
- [ ] 性能优化

## 🧪 测试
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 手动测试已完成

## 📸 截图 (如适用)
[添加截图]

## 📋 检查清单
- [ ] 代码符合项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
```

---

## ⚡ 性能优化

### 代码分割

```typescript
// ✅ 推荐 - 路由级别的懒加载
import { lazy, Suspense } from 'react';

const WardrobePage = lazy(() => import('./pages/WardrobePage'));
const OutfitPlanPage = lazy(() => import('./pages/OutfitPlanPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<WardrobePage />} />
        <Route path="/plan" element={<OutfitPlanPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 图片优化

```typescript
// ✅ 推荐 - 懒加载图片
import { useState, useEffect, useRef } from 'react';

export const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : 'data:image/svg+xml,...'} // placeholder
      alt={alt}
      loading="lazy"
    />
  );
};
```

### 列表虚拟化

```typescript
// ✅ 推荐 - 对长列表使用虚拟化
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualizedList: React.FC<{ items: ClothingItem[] }> = ({ items }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <WardrobeItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🔒 安全规范

### 环境变量

```typescript
// ✅ 推荐 - 永远不要在代码中硬编码敏感信息
// .env.local (不提交到 Git)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

// 使用
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}
```

### 输入验证

```typescript
// ✅ 推荐 - 始终验证用户输入
import { z } from 'zod';

const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['tops', 'bottoms', 'outerwear', 'footwear', 'accessories']),
  imageUrl: z.string().url(),
  price: z.number().positive().optional(),
  tags: z.array(z.string()).max(10),
});

export function validateCreateItem(data: unknown) {
  return createItemSchema.parse(data);
}

// 使用
try {
  const validData = validateCreateItem(userInput);
  await wardrobeService.addItem(validData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
  }
}
```

### XSS 防护

```typescript
// ✅ 推荐 - React 默认转义,但对于 dangerouslySetInnerHTML 要小心
import DOMPurify from 'dompurify';

export const SafeHTML: React.FC<{ html: string }> = ({ html }) => {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

---

## 📚 文档规范

### README.md 结构

```markdown
# Project Name

Brief description

## Features
- Feature 1
- Feature 2

## Tech Stack
- React 19
- TypeScript 5.8
- Vite 6
- Supabase

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm

### Installation
\`\`\`bash
npm install
\`\`\`

### Configuration
Copy `.env.example` to `.env.local` and fill in values

### Development
\`\`\`bash
npm run dev
\`\`\`

## Project Structure
[Brief overview]

## Contributing
See [CONTRIBUTING.md]

## License
MIT
```

### 代码注释

```typescript
// ✅ 推荐 - 注释"为什么",而不是"是什么"

// ❌ 避免
// Set loading to true
setLoading(true);

// ✅ 推荐
// Prevent duplicate API calls while fetching
if (isLoading) return;
setLoading(true);

// ✅ 推荐 - 复杂逻辑需要解释
/**
 * Calculate CPW (Cost Per Wear) with depreciation
 * 
 * Formula: (Purchase Price - Residual Value) / Wear Count
 * Residual Value = Purchase Price * 0.2 (assuming 20% retention)
 * 
 * This helps users understand the true value of their wardrobe items
 */
function calculateCPW(price: number, wearCount: number): number {
  const residualValue = price * 0.2;
  return wearCount > 0 ? (price - residualValue) / wearCount : price;
}
```

---

## 🚀 部署与发布

### 构建检查清单

- [ ] 所有测试通过
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 环境变量已配置
- [ ] 生产构建成功
- [ ] 性能指标达标 (Lighthouse Score > 90)
- [ ] 安全扫描通过

### 版本管理

遵循 [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

1.0.0 - 初始发布
1.1.0 - 新增功能 (向后兼容)
1.1.1 - Bug 修复
2.0.0 - 破坏性变更
```

---

## 📞 联系与支持

- **项目维护者**: [Your Name]
- **问题反馈**: GitHub Issues
- **文档更新**: 提交 PR 到 `.agent/PROJECT_STANDARDS.md`

---

**最后更新**: 2026-02-09  
**版本**: 1.0.0
