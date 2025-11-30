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

