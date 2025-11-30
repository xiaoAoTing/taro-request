# @lightgreen/taro-request

一个轻量级的 Taro3 框架 HTTP 请求库，提供 axios 风格的 API。

## ✨ 特性

- 🚀 基于 Taro3 框架，支持微信小程序、H5 等多端
- 🔧 支持请求/响应拦截器
- 📦 TypeScript 支持
- 🎯 零依赖（除了 @tarojs/taro）
- 💡 axios 风格的 API，简单易用

## 📦 安装

```bash
npm install @lightgreen/taro-request
# 或
pnpm add @lightgreen/taro-request
# 或
yarn add @lightgreen/taro-request
```

## 🔧 使用

### 基础用法

```typescript
import TaroRequest, { createRequest } from '@lightgreen/taro-request'

// 方式1: 使用工厂函数创建实例
const request = createRequest('https://api.example.com')

// 方式2: 直接使用类
const request2 = new TaroRequest('https://api.example.com')

// GET 请求
const users = await request.get('/users', { page: 1 })

// POST 请求
const newUser = await request.post('/users', {
  name: 'John',
  age: 30
})
```

### 使用拦截器

```typescript
import { createRequest } from '@lightgreen/taro-request'
import Taro from '@tarojs/taro'

const request = createRequest('https://api.example.com')

// 设置请求拦截器 - 自动添加 Token
request.setRequestInterceptor(async (config) => {
  // 获取 Token（从你的存储中）
  const token = Taro.getStorageSync('token')
  
  // 合并请求头
  config.header = {
    ...config.header,
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': token ? `Bearer ${token}` : ''
  }
  
  return config
})

// 设置响应拦截器 - 处理错误
request.setResponseInterceptor(async (response) => {
  if (response.statusCode >= 400) {
    if (response.statusCode === 401) {
      // Token 过期，跳转到登录页
      Taro.navigateTo({ url: '/pages/login/index' })
    }
    throw new Error(`请求失败: ${response.statusCode}`)
  }
  
  // 返回响应数据
  return response.data
})
```

### 完整示例

```typescript
import { createRequest } from '@lightgreen/taro-request'
import Taro from '@tarojs/taro'

// 创建请求实例
const api = createRequest('https://api.example.com')

// 配置请求拦截器
api.setRequestInterceptor(async (config) => {
  // 获取 Token
  const token = Taro.getStorageSync('token')
  
  // 自动添加请求头
  config.header = {
    ...config.header,
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': token ? `Bearer ${token}` : ''
  }
  
  // 添加时间戳防止缓存
  if (config.data && typeof config.data === 'object') {
    config.data = {
      _t: Date.now(),
      ...config.data
    }
  }
  
  return config
})

// 配置响应拦截器
api.setResponseInterceptor(async (response) => {
  const { statusCode, data } = response
  
  // 处理 HTTP 错误
  if (statusCode >= 400) {
    if (statusCode === 401) {
      // Token 过期处理
      Taro.removeStorageSync('token')
      Taro.navigateTo({ url: '/pages/login/index' })
      throw new Error('登录已过期，请重新登录')
    }
    throw new Error(`请求失败: ${statusCode}`)
  }
  
  // 处理业务错误（根据后端返回结构调整）
  if (data && typeof data === 'object' && 'code' in data) {
    if (data.code !== 200) {
      Taro.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      throw new Error(data.message || '请求失败')
    }
    return data.data // 返回实际数据
  }
  
  return data
})

// 使用
export const getUserList = async (page: number) => {
  return api.get('/users', { page })
}

export const createUser = async (userData: { name: string; age: number }) => {
  return api.post('/users', userData)
}
```

## 📚 API 文档

### TaroRequest

核心请求类。

#### 构造函数

```typescript
new TaroRequest(baseURL?: string)
```

- `baseURL`: 基础 URL，可选

#### 方法

##### request(config: RequestConfig): Promise<TaroResponse>

发起请求。

```typescript
const response = await request.request({
  url: '/users',
  method: 'GET',
  data: { page: 1 },
  header: { 'Content-Type': 'application/json' },
  timeout: 30000
})
```

##### get(url: string, data?: any, config?: Partial<RequestConfig>): Promise<TaroResponse>

GET 请求。

```typescript
const users = await request.get('/users', { page: 1 })
```

##### post(url: string, data?: any, config?: Partial<RequestConfig>): Promise<TaroResponse>

POST 请求。

```typescript
const newUser = await request.post('/users', { name: 'John' })
```

##### put(url: string, data?: any, config?: Partial<RequestConfig>): Promise<TaroResponse>

PUT 请求。

```typescript
const updatedUser = await request.put('/users/1', { name: 'Jane' })
```

##### delete(url: string, data?: any, config?: Partial<RequestConfig>): Promise<TaroResponse>

DELETE 请求。

```typescript
await request.delete('/users/1')
```

##### setRequestInterceptor(interceptor: Function): void

设置请求拦截器。

```typescript
request.setRequestInterceptor(async (config) => {
  // 修改请求配置
  config.header = { ...config.header, 'X-Custom-Header': 'value' }
  return config
})
```

##### setResponseInterceptor(interceptor: Function): void

设置响应拦截器。

```typescript
request.setResponseInterceptor(async (response) => {
  // 处理响应
  if (response.statusCode === 401) {
    // 处理未授权
  }
  return response
})
```

### 工厂函数

#### createRequest(baseURL?: string): TaroRequest

创建请求实例的工厂函数。

```typescript
const request = createRequest('https://api.example.com')
```

## 🔍 类型定义

```typescript
// 请求配置
interface RequestConfig {
  url: string
  method?: HttpMethod
  data?: any
  header?: Record<string, string>
  timeout?: number
  [key: string]: any
}

// 响应
interface TaroResponse {
  statusCode: number
  data: any
  header: Record<string, string>
  cookies?: string[]
  [key: string]: any
}

// HTTP 方法
type HttpMethod = 'GET' | 'POST' | 'OPTIONS' | 'HEAD' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
```

## 🛠️ 本地调试

### 方法一：使用 pnpm link（推荐）

1. **在库目录中创建链接**
```bash
cd /path/to/taro-request
pnpm link
```

2. **在 Taro 项目中使用链接**
```bash
cd /path/to/your-taro-project
pnpm link @lightgreen/taro-request
```

3. **启动开发模式（自动监听文件变化并重新构建）**
```bash
# 在库目录中运行
pnpm dev
```

4. **在 Taro 项目中正常使用**
```typescript
import TaroRequest, { createRequest } from '@lightgreen/taro-request'
```

### 方法二：使用 file: 协议

在你的 Taro 项目的 `package.json` 中：

```json
{
  "dependencies": {
    "@lightgreen/taro-request": "file:../taro-request"
  }
}
```

然后运行：
```bash
pnpm install
```

### 方法三：使用 npm link

如果使用 npm：

```bash
# 在库目录中
cd /path/to/taro-request
npm link

# 在 Taro 项目中
cd /path/to/your-taro-project
npm link @lightgreen/taro-request
```

### 开发脚本

- `pnpm build` - 构建一次
- `pnpm dev` - 监听模式，文件变化时自动重新构建
- `pnpm type-check` - 类型检查

### 注意事项

- 使用 `pnpm link` 后，修改库的源码需要重新构建（或使用 `pnpm dev` 自动构建）
- 如果遇到模块找不到的问题，尝试删除 `node_modules` 和锁文件后重新安装
- 调试完成后，记得取消链接：`pnpm unlink @lightgreen/taro-request`

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！