import { ColumnProps, ImageProps, UserProps } from './store'

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

interface CheckCondition {
  format?: string[];
  size?: number;
}
// format :["image/png"]   file-type: image/jpeg
// const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  //format存在 即判定format包含是否file.type，没有包含返回true
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidSize) {
    error = 'size'
  }
  if (!isValidFormat) {
    error = 'format'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}