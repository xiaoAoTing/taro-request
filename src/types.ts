/**
 * 请求配置接口
 */
export interface RequestConfig {
  url: string
  method?: HttpMethod
  data?: any
  header?: Record<string, string>
  timeout?: number
  [key: string]: any
}

/**
 * HTTP 方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'OPTIONS' | 'HEAD' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

/**
 * Taro 响应接口
 */
export interface TaroResponse {
  statusCode: number
  data: any
  header: Record<string, string>
  cookies?: string[]
  [key: string]: any
}

/**
 * 拦截器接口
 */
export interface Interceptors {
  request: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig
  response: (response: TaroResponse) => Promise<TaroResponse> | TaroResponse
}

/**
 * 请求头配置接口
 */
export interface RequestHeadersConfig {
  contentType?: string
}

/**
 * 获取 Token 的回调函数类型
 */
export type GetTokenCallback = () => string | null | undefined

/**
 * Token 过期处理回调函数类型
 */
export type OnTokenExpiredCallback = () => void

/**
 * 请求配置选项
 */
export interface RequestOptions {
  /**
   * 获取 Token 的回调函数
   */
  getToken?: GetTokenCallback
  /**
   * Token 过期时的回调函数
   */
  onTokenExpired?: OnTokenExpiredCallback
  /**
   * 是否自动添加时间戳防止缓存
   * @default true
   */
  addTimestamp?: boolean
  /**
   * 默认 Content-Type
   * @default 'application/json;charset=UTF-8'
   */
  defaultContentType?: string
}

