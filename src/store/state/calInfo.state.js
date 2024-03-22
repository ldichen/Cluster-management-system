export default {
  state: {
    dataList: [
      // {
      //   ip: '1.1.1.1',
      //   server: {
      //     cpuNum: 16,
      //     hostname: '1DESKTOP-V5CGNRM',
      //     systemType: 'Windows_NT',
      //     platform: 'win32',
      //     release: '10.0.19044',
      //     totalMem: '31.9 GB',
      //     freeMem: '10.9 GB',
      //     usageMem: 25,
      //     processDisk: 'E',
      //     totalDisk: '600GB',
      //     freeDisk: '283GB',
      //     usageDisk: 53
      //   }
      // },
      // {
      //   ip: '1.1.1.2',
      //   server: {
      //     cpuNum: 17,
      //     hostname: '2DESKTOP-V5CGNRM',
      //     systemType: 'Windows_NT',
      //     platform: 'win32',
      //     release: '10.0.19044',
      //     totalMem: '31.9 GB',
      //     freeMem: '10.9 GB',
      //     usageMem: 35,
      //     processDisk: 'E',
      //     totalDisk: '600GB',
      //     freeDisk: '283GB',
      //     usageDisk: 53
      //   }
      // },
      // {
      //   ip: '1.1.1.3'
      //   // server: {
      //   //   cpuNum: 18,
      //   //   hostname: '3DESKTOP-V5CGNRM',
      //   //   systemType: 'Windows_NT',
      //   //   platform: 'win32',
      //   //   release: '10.0.19044',
      //   //   totalMem: '31.9 GB',
      //   //   freeMem: '10.9 GB',
      //   //   usageMem: 61,
      //   //   processDisk: 'E',
      //   //   totalDisk: '600GB',
      //   //   freeDisk: '283GB',
      //   //   usageDisk: 53
      //   // }
      // },
      // {
      //   ip: '1.1.1.4',
      //   server: {
      //     cpuNum: 19,
      //     hostname: '4DESKTOP-V5CGNRM',
      //     systemType: 'Windows_NT',
      //     platform: 'win32',
      //     release: '10.0.19044',
      //     totalMem: '31.9 GB',
      //     freeMem: '10.9 GB',
      //     usageMem: 90,
      //     processDisk: 'E',
      //     totalDisk: '600GB',
      //     freeDisk: '283GB',
      //     usageDisk: 53
      //   }
      // }
    ]
  },
  mutations: {
    setcalListInfo(state, calListInfo) {
      calListInfo.forEach((item) => {
        state.dataList.push(item)
      })
    },
    //编辑只能改变value
    // editcalListInfo(state, type, id, label) {
    //   state.dataList.forEach((item) => {
    //     if (state.dataList.id == id) {
    //       if (type == 1) {
    //         item.labels.push(label)
    //       } else if (type == 2) {
    //         item.labels[label.key] = label.value
    //       } else if (type == 3) {
    //         delete item.labels[label.key]
    //       }
    //     }
    //   })
    // },
    cleanCalListInfo(state) {
      state.dataList.length = 0
    }
  }
}
