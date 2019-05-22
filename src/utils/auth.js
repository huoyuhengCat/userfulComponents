// import memoize from 'lodash/memoize'
export const setTokens = token => {
  localStorage.setItem('authorization', token)
}
export const getTokens = () => {
  return localStorage.getItem('authorization')
}
export const deleteTokens = token => {
  localStorage.clear()
}
export const getMenuUrl = (arr) => {
  const map = {}
  return (function getMenu (arr) {
    arr.forEach((value, key) => {
      map[value.menuUrl] = value
      getMenu(value.subMenu)
    })
    return map
  }(arr))
}
