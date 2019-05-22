// 手机号验证
export function isvalidPhone (rule, value, callback) {
  const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
// 邮箱验证
export function isvalidEmail (rule, value, callback) {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的电子邮箱'))
  } else {
    callback()
  }
}
export const isEnglishName = (rule, value, callback) => {
  const reg = /^[A-Za-z]+$/
  if (!reg.test(value)) {
    callback(new Error('请输入纯英文字符'))
  } else {
    callback()
  }
}
export function isName (rule, value, callback) {
  const reg = /[a-zA-Z0-9]{6,20}$/
  if (!reg.test(value)) {
    callback(new Error('名字格式验证错误'))
  } else {
    callback()
  }
}
export function isPassword (rule, value, callback) {
  // 长度在 6 到 20个数字或英文字符
  const reg = /[a-zA-Z0-9]{6,20}$/
  if (!reg.test(value)) {
    callback(new Error('长度在 6 到 20个数字或英文字符'))
  } else {
    callback()
  }
}
