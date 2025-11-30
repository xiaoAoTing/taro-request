import Taro from '@tarojs/taro'
import { CONTENT_TYPE } from './constants'
import type { RequestHeadersConfig, GetTokenCallback, OnTokenExpiredCallback } from './types'

/**
 * 获取请求头
 * @param config - 请求头配置
 * @param getToken - 获取 Token 的回调函数
 * @param defaultContentType - 默认 Content-Type
 * @returns 请求头对象
 */
export function getRequestHeaders(
  config?: RequestHeadersConfig,
  getToken?: GetTokenCallback,
  defaultContentType: string = CONTENT_TYPE.json
): Record<string, string> {
  const header: Record<string, string> = {}

  // 获取 token
  if (getToken) {
    const token = getToken()
    if (token) {
      header.Authorization = token
    }
  }

  // 设置 Content-Type
  header['Content-Type'] = config?.contentType || defaultContentType

  return header
}

/**
 * Token 过期处理
 * @param onTokenExpired - Token 过期回调函数
 */
export function handleExpireToken(onTokenExpired?: OnTokenExpiredCallback): void {
  if (onTokenExpired) {
    onTokenExpired()
  }
}

/**
 * 显示错误消息
 * @param message - 错误消息
 */
export function showErrorMsg(message: string): void {
  Taro.showToast({
    title: message,
    icon: 'none'
  })
}

