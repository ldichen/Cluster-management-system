export default {
  state: {
    dataList: []
  },
  mutations: {
    setproxyListInfo(state, proxyListInfo) {
      proxyListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanproxyListInfo(state) {
      state.dataList.length = 0
    }
  }
}
