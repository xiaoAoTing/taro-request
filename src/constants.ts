/**
 * Content-Type 常量
 */
export const CONTENT_TYPE = {
  /** JSON 格式 */
  json: 'application/json;charset=UTF-8',
  /** 文本格式 */
  text: 'text/plain;charset=UTF-8',
  /** Form URL Encoded 格式 */
  formUrlencoded: 'application/x-www-form-urlencoded;charset=UTF-8',
  /** Form Data 格式（用于文件上传） */
  formData: 'multipart/form-data;charset=UTF-8'
} as const

