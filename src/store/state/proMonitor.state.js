export default {
  state: {
    dataList: []
  },
  mutations: {
    setmonitorListInfo(state, monitorListInfo) {
      monitorListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanmonitorListInfo(state) {
      state.dataList.length = 0
    }
  }
}
