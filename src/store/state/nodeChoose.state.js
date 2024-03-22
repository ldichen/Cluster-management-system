export default {
  state: {
    dataList: []
  },
  mutations: {
    setnodeListInfo(state, nodeListInfo) {
      nodeListInfo.forEach((item) => {
        state.dataList.push(item)
      })
      // state.dataList.push(modelListInfo)
      // console.log(state.dataList)
    }
  }
}
