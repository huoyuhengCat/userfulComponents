const getters = {
  cancelTokens: state => state.cancelAxios.cancelTokens,
  userInfo: state => state.userInfo,
  userMap: state => state.userInfo.userMap
}
export default getters
