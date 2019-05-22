export const setLocalKey = (key, value) => {
  localStorage.setItem(key, value)
}
export const getLocalKey = (key) => {
  return localStorage.getItem(key)
}
export const deleteLocalKey = (key) => {
  localStorage.removeItem(key)
}
export const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval)
  })
}
