import TaroRequestDefault from './request'
import { createRequest } from './request'
import { getRequestHeaders, handleExpireToken, showErrorMsg } from './helpers'
import { CONTENT_TYPE } from './constants'
import type {
  RequestConfig,
  TaroResponse,
  Interceptors,
  HttpMethod,
  RequestHeadersConfig,
  GetTokenCallback,
  OnTokenExpiredCallback,
  RequestOptions
} from './types'

// 导出核心类
export { createRequest }
export { TaroRequestDefault as TaroRequest }

// 导出辅助函数
export { getRequestHeaders, handleExpireToken, showErrorMsg }

// 导出常量
export { CONTENT_TYPE }

// 导出类型
export type {
  RequestConfig,
  TaroResponse,
  Interceptors,
  HttpMethod,
  RequestHeadersConfig,
  GetTokenCallback,
  OnTokenExpiredCallback,
  RequestOptions
}

// 创建默认请求实例（可以根据需要配置 baseURL）
export const request = createRequest()

