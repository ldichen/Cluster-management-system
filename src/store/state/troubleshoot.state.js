export default {
  state: {
    dataList: []
  },
  mutations: {
    setrecordListInfo(state, recordListInfo) {
      recordListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanrecordListInfo(state) {
      state.dataList.length = 0
    }
  }
}
