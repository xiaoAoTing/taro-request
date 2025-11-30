import Taro from '@tarojs/taro'
import type { RequestConfig, TaroResponse, Interceptors, HttpMethod } from './types'

// 重新导出类型
export type { RequestConfig, TaroResponse, Interceptors, HttpMethod } from './types'

/**
 * TaroRequest 类 - 用于处理 Taro 框架网络请求的封装类
 * 
 * @example
 * ```typescript
 * // 创建请求实例
 * const request = new TaroRequest('https://api.example.com')
 * 
 * // 设置请求拦截器
 * request.setRequestInterceptor(async config => {
 *   config.header = {
 *     'Authorization': 'Bearer token'
 *   }
 *   return config
 * })
 * 
 * // 设置响应拦截器
 * request.setResponseInterceptor(async response => {
 *   if(response.statusCode === 401) {
 *     // 处理未授权
 *   }
 *   return response.data
 * })
 * 
 * // 发起GET请求
 * request.get('/users', { page: 1 })
 *   .then(res => {
 *     console.log(res)
 *   })
 *   .catch(err => {
 *     console.error(err)
 *   })
 * 
 * // 发起POST请求
 * request.post('/users', {
 *   name: 'test',
 *   age: 18
 * }).then(res => {
 *   console.log(res)
 * })
 * ```
 */
export default class TaroRequest {
  private baseURL: string
  private interceptors: Interceptors

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
    this.interceptors = {
      request: async (config: RequestConfig) => config,
      response: async (response: TaroResponse) => response
    }
  }

  /**
   * 处理路径防止出现双斜杠
   * @param baseURL - 基础URL
   * @param url - 请求URL
   * @returns 拼接后的完整URL
   */
  private join(baseURL: string, url: string): string {
    // 如果 url 是完整路径（包含 http:// 或 https://），直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    const trimmedBaseURL = baseURL.replace(/\/+$/, '')
    const trimmedUrl = url.replace(/^\/+/, '')

    // 如果 baseURL 为空，直接返回 url
    if (!trimmedBaseURL) {
      return trimmedUrl
    }

    return `${trimmedBaseURL}/${trimmedUrl}`
  }

  /**
   * 发起请求
   * @param config - 请求配置
   * @returns Promise<TaroResponse>
   */
  async request(config: RequestConfig): Promise<TaroResponse> {
    try {
      // 执行请求拦截器
      config = await this.interceptors.request(config)

      // 拼接完整URL
      const fullUrl = this.join(this.baseURL, config.url)

      // 发起 Taro 请求
      const response = await new Promise<TaroResponse>((resolve, reject) => {
        Taro.request({
          url: fullUrl,
          method: (config.method || 'GET') as any,
          data: config.data,
          header: config.header || {},
          timeout: config.timeout || 30000,
          success: async (res: Taro.request.SuccessCallbackResult) => {
            try {
              // 构造响应对象
              const taroResponse: TaroResponse = {
                statusCode: res.statusCode,
                data: res.data,
                header: res.header || {},
                cookies: res.cookies
              }

              // 执行响应拦截器
              const processedResponse = await this.interceptors.response(taroResponse)
              resolve(processedResponse)
            } catch (error) {
              reject(error)
            }
          },
          fail: (err: TaroGeneral.CallbackResult) => {
            reject(err)
          }
        })
      })

      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * GET 请求
   * @param url - 请求地址
   * @param data - 请求参数（会作为 query 参数）
   * @param config - 请求配置
   * @returns Promise<TaroResponse>
   */
  get(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<TaroResponse> {
    return this.request({
      ...config,
      url,
      data,
      method: 'GET'
    })
  }

  /**
   * POST 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Promise<TaroResponse>
   */
  post(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<TaroResponse> {
    return this.request({
      ...config,
      url,
      data,
      method: 'POST'
    })
  }

  /**
   * PUT 请求
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Promise<TaroResponse>
   */
  put(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<TaroResponse> {
    return this.request({
      ...config,
      url,
      data,
      method: 'PUT'
    })
  }

  /**
   * DELETE 请求
   * @param url - 请求地址
   * @param data - 请求参数
   * @param config - 请求配置
   * @returns Promise<TaroResponse>
   */
  delete(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<TaroResponse> {
    return this.request({
      ...config,
      url,
      data,
      method: 'DELETE'
    })
  }

  /**
   * 设置请求拦截器
   * @param interceptor - 拦截器函数
   */
  setRequestInterceptor(
    interceptor: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig
  ): void {
    this.interceptors.request = interceptor
  }

  /**
   * 设置响应拦截器
   * @param interceptor - 拦截器函数
   */
  setResponseInterceptor(
    interceptor: (response: TaroResponse) => Promise<TaroResponse> | TaroResponse
  ): void {
    this.interceptors.response = interceptor
  }
}

/**
 * 创建请求实例的工厂函数
 * @param baseURL - 基础URL
 * @returns TaroRequest 实例
 */
export function createRequest(baseURL: string = '') {
  return new TaroRequest(baseURL)
}

