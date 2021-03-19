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
/**
 * 数组转对象，key为current中的_id
 * 
 * 直接使用current._id报错，要定义约束泛型extends
 * reduce 第一个传值回调函数：prev-之前结果，current-当前结果
 *        第二个传值初始值：这里{}, 在空对象赋值current._id报错,所以类型断言{} as {[key: string]: T}
 * @param arr 
 * @returns prev
 */
export const arrToObj = <T extends {_id?: string}>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if(current._id) {
      prev[current._id] = current
    }
    return prev
  },{} as {[key: string]: T})
}

/**
 * 对象转数组
 * 
 * 对象先转为数组Object.keys(obj)
 * @param obj 
 * @returns 
 */
export const objToArr = <T>(obj: {[key:string]: T}) => {
  return Object.keys(obj).map(key =>obj[key])
}

