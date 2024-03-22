export default {
  state: {
    dataList: [
      // {
      //   name: 'model1',
      //   date: '2024-02-26',
      //   nodeInfo: ['0.0.0.0', '1.1.1.1', '2.2.2.2']
      // },
      // {
      //   name: 'model2',
      //   date: '2024-02-25',
      //   nodeInfo: ['0.0.0.0', '1.1.1.1', '2.2.2.2']
      // },
      // {
      //   name: 'model3',
      //   date: '2024-02-24',
      //   nodeInfo: ['0.0.0.0', '1.1.1.1', '2.2.2.2']
      // }
    ]
  },
  mutations: {
    setmodelListInfo(state, modelListInfo) {
      modelListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    cleanModelListInfo(state) {
      state.dataList.length = 0
    }
  }
}
