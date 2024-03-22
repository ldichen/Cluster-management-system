export default {
  state: {
    dataList: []
  },
  mutations: {
    setconfigListInfo(state, configListInfo) {
      configListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanconfigListInfo(state) {
      state.dataList.length = 0
    }
  }
}
