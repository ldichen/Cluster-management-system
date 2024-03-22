<template>
  <div class="nodeInfo-title">
    <div class="nodeInfo-title-name">部署模型列表</div>
    <div class="nodeInfo-title-search">
      <el-input v-model="data.input" size="large" placeholder="请输入模型名称" />
      <el-button type="success" size="large" :icon="Search">搜索</el-button>
    </div>
    <div>
      <el-button type="primary" size="large" @click="data.arrangeVisible = true"
        >部署模型</el-button
      >
    </div>
  </div>
  <div class="nodeInfo-tables">
    <div class="nodeInfo-table">
      <el-table
        :data="data.modelInfoData"
        highlight-current-row
        @cell-click="handleModelCellChange"
        size="large"
        stripe
        :table-layout="fixed"
        height="45rem"
        max-height="40rem"
        style="width: 25rem"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          textAlign: 'center',
          'background-color': 'rgb(235, 243, 251)',
          border: '2px solid #dedfe0'
        }"
      >
        <el-table-column prop="name" class-name="firstCol" label="模型名称" width="100%" />
      </el-table>
    </div>
    <nodeMoveInfo
      v-if="data.nodeInfoVisible"
      :nodeInfo="data.nodeInfo"
      @selectNodeInfo="setSelectNodeInfo"
    ></nodeMoveInfo>

    <div class="nodeInfo-button" v-if="data.nodeInfoVisible">
      <el-button class="nodeInfo-button-move" type="primary" size="large" @click="handleMove"
        >开始迁移</el-button
      >
    </div>
  </div>

  <el-dialog
    v-model="data.arrangeVisible"
    title="模型部署"
    width="25%"
    align-center
    center
    @close="clearForm()"
  >
    <div class="arrange-form">
      <el-form
        label-position="right"
        label-width="auto"
        :model="data.formdata"
        style="max-width: 600px"
      >
        <el-form-item label="模型名称：" size="default">
          <el-input v-model="data.formdata.modelName" size="default" />
        </el-form-item>
        <el-upload
          action="none"
          :limit="1"
          :auto-upload="false"
          accept=".zip"
          :file-list="data.filelist"
          :on-change="handleChange"
          :on-remove="handleRemove"
        >
          <template #trigger>
            <el-button type="primary" size="large">上传模型部署包</el-button>
          </template>
        </el-upload>

        <el-form-item label="目标节点：" v-if="isNodes" size="default">
          <el-table
            :data="data.nodeList"
            stripe
            style="width: 95%; font-size: 0.85rem; line-height: 1.5rem; border: 1px solid #dcdfe6"
            height="13.6rem"
            max-height="13.6rem"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{
              textAlign: 'center'
            }"
            @selection-change="nodeSelect"
          >
            <el-table-column type="selection" width="30" />
            <el-table-column property="ip.ip" label="节点" width="100" />
            <el-table-column property="ip.score" label="得分" width="50" />
          </el-table>
          <div>
            <el-pagination
              v-model:current-page="data.nodeCurrentPage"
              :background="true"
              :hide-on-single-page="true"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clearForm" size="large">取消</el-button>
        <el-button type="primary" @click="submitData" size="large"> 部署 </el-button>
      </div>
    </template>
  </el-dialog>

  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="data.currentPage"
      v-model:page-size="data.pageSize"
      :page-sizes="data.pageSizes"
      :background="true"
      :hide-on-single-page="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, toRefs, computed } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import store from '@/store'
import {
  getModelData,
  getNodeList,
  migrate,
  uploadFile,
  postTolerantConfig,
  getNodesConfig,
  modeDeploy
} from '@/api/business/data'
import nodeMoveInfo from './nodeMoveInfo.vue'
const data = reactive({
  modelInfoData: [],
  input: '',
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500,
  nodeInfoVisible: false,
  nodeInfo: [],
  selectNodeInfo: [],
  currentMd5: '',
  currentMSR: [],
  currentName: '',
  arrangeVisible: false,
  formdata: {
    modelName: '',
    selectIp: []
  },
  filelist: [],
  nodeList: [],
  status: ['success', 'info', 'warning'],
  tempFilesInfo: [],
  nodeCurrentPage: 1
})
onMounted(() => {
  getDataList()
})

//get data from interface
const getDataList = () => {
  let params = {
    asc: false,
    page: data.currentPage,
    pageSize: data.pageSize,
    searchText: '',
    sortField: 'createTime'
  }
  getModelData(params).then((res) => {
    if (res.code == 200) {
      store.commit('cleanModelListInfo')
      store.commit('setmodelListInfo', res.data.content)
      data.pageTotal = Number(res.data.total)
      loadList()
    } else {
      ElNotification({
        title: 'Error',
        message: res.msg,
        type: 'error'
      })
    }
  })
}
//load Data
const loadList = () => {
  data.modelInfoData.length = 0
  store.state.modelListInfo.dataList.forEach((item) => {
    data.modelInfoData.push(item)
  })
}

//deploy model

//getnodeList
const getConfigNodeList = () => {
  let pid = data.tempFilesInfo.md5
  getNodesConfig(pid).then((res) => {
    if (res.code == 200) {
      data.nodeList.length = 0
      res.data.forEach((item) => {
        let node = { ip: item }
        data.nodeList.push(node)
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.message,
        type: 'error'
      })
    }
  })
}

// 上传文件
const handleChange = (file, fileList) => {
  data.filelist = fileList
  if (data.filelist.length) {
    let file = ''
    file = data.filelist[0].raw
    let formdata = new FormData()
    formdata.append('file', file)
    uploadFile(formdata).then((res) => {
      if (res.code == 200) {
        data.tempFilesInfo.length = 0
        ElNotification({
          title: 'Success',
          message: '获取配置信息成功',
          type: 'success'
        })
        data.tempFilesInfo = res.data
        getConfigNodeList()
      } else {
        ElNotification({
          title: 'Error',
          message: res.message,
          type: 'error'
        })
      }
    })
  }
}

// 移除文件
const handleRemove = (file, fileList) => {
  data.filelist.length = 0
  data.tempFilesInfo.length = 0
  data.nodeList.length = 0
}

//isNodes
const isNodes = computed(() => {
  if (data.nodeList.length) {
    return true
  } else {
    return false
  }
})

//nodeSelect
const nodeSelect = (items) => {
  data.formdata.selectIp.length = 0
  items.forEach((item) => {
    data.formdata.selectIp.push(item.ip.ip)
  })
}

const submitData = () => {
  if (data.formdata.selectIp.length) {
    let params = {
      md5: data.tempFilesInfo.md5,
      modelName: data.formdata.modelName,
      targetIp: data.formdata.selectIp
    }
    console.log(params)
    modeDeploy(params).then((res) => {
      console.log(res)
      if (res.code == 200) {
        ElNotification({
          title: 'Success',
          message: res.message,
          type: 'success'
        })
        clearForm()
      } else {
        ElNotification({
          title: 'Error',
          message: res.message,
          type: 'error'
        })
      }
    })
  } else {
    ElMessage.warning('请选择上传文件!')
  }
}

//reset
const clearForm = () => {
  data.formdata.modelName = ''
  data.filelist.length = 0
  data.tempFilesInfo.length = 0
  data.formdata.selectIp = 0
  data.nodeList.length = 0
  data.arrangeVisible = false
}

const handleModelCellChange = (info) => {
  //开始传数据
  data.nodeInfoVisible = true
  data.currentMd5 = info.md5
  data.currentName = info.name
  data.currentMSR = info.deployedMSR
  getNodeList(data.currentMd5).then((res) => {
    if (res.code == 200) {
      data.nodeInfo.length = 0
      res.data.forEach((element) => {
        var node = { node: element }
        data.nodeInfo.push(node)
      })

      // console.log(data.nodeInfo)
    } else {
      ElNotification({
        title: 'Error',
        message: res.msg,
        type: 'error'
      })
    }
  })
}
const setSelectNodeInfo = (info) => {
  data.selectNodeInfo = info
}
const handleMove = () => {
  var IPs = []
  data.selectNodeInfo.forEach((item) => {
    IPs.push(item.node.ip)
  })
  let params = {
    deployedMSR: data.currentMSR,
    modelMd5: data.currentMd5,
    modelName: data.currentName,
    targetIp: IPs
  }
  migrate(params).then((res) => {
    if (res.code == 200) {
      ElNotification({
        title: 'Success',
        message: res.msg,
        type: 'success'
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.msg,
        type: 'error'
      })
    }
  })
}
//pagination
const handleSizeChange = () => {
  getDataList()
  data.nodeInfoVisible = false
}

const handleCurrentChange = () => {
  getDataList()
  data.nodeInfoVisible = false
}
</script>

<style scoped>
/* Button business */
.nodeInfo-title {
  display: flex;
  height: 3rem;
  padding: 1rem;
  justify-content: space-between;
}
.nodeInfo-title-name {
  font-weight: bold;
  font-size: 1.5rem;
  /* margin-right: 5rem; */
}
.el-input {
  width: 50rem;
  margin-right: 1rem;
}
/* Button style */
/* .button-application .el-button {
    margin: 0 2rem;
  } */
.nodeInfo-tables {
  display: flex;
  width: 100%;
  justify-content: center;
}
.nodeInfo-table {
  margin-top: 1rem;
  margin-right: 2rem;
  margin-left: 2rem;
  display: flex;
  max-width: 50rem;
  justify-content: center;
}
.el-table {
  /* font-weight: bold;
    color: black; */
  max-width: 100%;
  /* width: 1rem; */
  width: 10rem;
  font-size: 1rem;
}
:deep(.el-table__header-wrapper) {
  display: flex !important;
  justify-content: center !important;
}
:deep(.el-table__header) {
  width: 100% !important;
  background-color: aqua !important;
}
:deep(.el-scrollbar__view) {
  display: flex !important;
  justify-content: center !important;
}
:deep(.el-table__body) {
  width: 25rem !important;
  border-right: 1px solid #dedfe0;
  border-left: 1px solid #dedfe0;
  border-bottom: 1px solid #dedfe0;
}
:deep(.firstCol) {
  font-weight: bold !important;
}
.nodeInfo-button {
  margin-top: 20rem;

  /* position: absolute;
  top: 68%;
  width: 10rem;
  margin: 3rem;
  left: 61%; */
}
.nodeInfo-button-move {
  /* position: absolute;
  right: 20rem; */
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
