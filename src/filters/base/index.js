export const formatSystemType = (value) => {
  let str
  switch (value) {
    case '1':
      str = '系统组织'
      break
    case '2':
      str = '业务组织'
      break
    default:
      str = '非匹配值'
      break
  }
  return str
}
export const formatShowType = (value) => {
  let str
  switch (value) {
    case '0':
      str = '隐藏'
      break
    case '1':
      str = '显示'
      break
    default:
      str = '非匹配值'
      break
  }
  return str
}
