<template>
  <div class="configInfo-title">
    <div class="configInfo-title-name">容错配置列表</div>
    <div class="configInfo-title-search">
      <el-input v-model="data.input" size="large" placeholder="请输入模型名称" />
      <el-button type="success" size="large" :icon="Search">搜索</el-button>
    </div>
    <div>
      <el-button type="primary" size="large" @click="delolyClick()">配置模型</el-button>
    </div>
  </div>
  <div class="configInfo-table">
    <el-table
      :data="data.recordData"
      size="large"
      stripe
      height="45rem"
      max-height="45rem"
      width="50"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        textAlign: 'center'
      }"
    >
      <el-table-column prop="name" class-name="firstCol" label="模型名称" width="180" />

      <el-table-column prop="policy" label="配置信息" width="180">
        <template #default="scope">
          <el-space direction="vertical" style="gap: unset">
            <el-text class="textValue"
              ><el-text class="textKey">策略名称 :&nbsp;&nbsp;</el-text
              >{{ isUndefined(scope.row.policy, 'policyName') }} <br />
              <el-text class="textKey">策略模式 :&nbsp;&nbsp;</el-text
              >{{ isUndefined(scope.row.policy, 'haMode') }}</el-text
            >
            <el-tooltip placement="right" v-if="scope.row.policy.haMode == 'nodes'">
              <template #content>
                <div style="margin: 0.5rem 0">
                  <li
                    class="deployedInfo-table-nodeInfo-li"
                    :key="item"
                    v-for="item in scope.row.policy.targetIp.length > 0
                      ? scope.row.policy.targetIp
                      : ['无']"
                  >
                    <el-link type="primary" style="font-size: 1.2rem">{{ item }}</el-link>
                  </li>
                </div>
              </template>
              <el-button size="default">目标节点</el-button>
            </el-tooltip>
            <el-text
              ><el-text class="textKey" v-if="scope.row.policy.haMode == 'exactly'"
                >数量 :&nbsp;&nbsp;</el-text
              >
              {{ isUndefined(scope.row.policy, 'count') }}
            </el-text>
          </el-space>
        </template></el-table-column
      >
      <el-table-column prop="deployedNodes" label="节点信息" width="180">
        <template #default="scope">
          <el-tooltip
            placement="right"
            effect="dark"
            popper-class="deployedInfo-table-nodeInfo-popper"
          >
            <template #content>
              <div style="margin: 0.5rem 0">
                <li
                  class="deployedInfo-table-nodeInfo-li"
                  :key="item"
                  v-for="item in scope.row.deployedNodes.length > 0
                    ? scope.row.deployedNodes
                    : ['无']"
                >
                  <el-link type="primary" style="font-size: 1.2rem">{{ item }}</el-link>
                </li>
              </div>
            </template>
            <el-button size="default">查看节点</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" sortable label="创建时间" width="180" />
    </el-table>
  </div>
  <el-dialog
    v-model="data.arrangeVisible"
    title="配置模型"
    width="25%"
    top
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
        <el-form-item label="策略名称：" size="default">
          <el-input v-model="data.formdata.policyName" size="default" />
        </el-form-item>
        <el-form-item label="策略模式：" size="default">
          <el-select
            v-model="data.currentSelectItem"
            placeholder="策略模式"
            style="width: 10rem"
            @change="selectChange"
            size="default"
          >
            <el-option
              v-for="item in data.selectItem"
              :key="item"
              :label="item.mode"
              :value="item.mode"
              style="font-size: 1rem"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量：" v-if="data.currentSelectItem == 'exactly'" size="default">
          <el-input v-model="data.formdata.count" style="width: 5rem" />
        </el-form-item>
        <el-form-item
          class="targetIp"
          label="目标节点："
          v-if="data.currentSelectItem == 'nodes'"
          size="default"
        >
          <el-table
            :data="data.nodeList"
            stripe
            style="width: 95%; font-size: 0.85rem; line-height: 1.5rem; border: 1px solid #dcdfe6"
            height="14rem"
            max-height="14rem"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{
              textAlign: 'center'
            }"
            @selection-change="nodeSelect"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column property="ip" label="节点" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="dataState(scope.row.status)" class="nodeStatusText" effect="dark">{{
                  scope.row.status
                }}</el-tag>
              </template></el-table-column
            >
          </el-table>
          <div class="demo-pagination-block" style="width: 18rem">
            <el-pagination
              v-model:current-page="data.nodeCurrentPage"
              v-model:page-size="data.nodePageSize"
              :total="data.nodePageTotal"
              :pager-count="3"
              :hide-on-single-page="false"
              layout="prev, pager, next"
            />
          </div>
        </el-form-item>
        <el-upload
          action="none"
          :limit="1"
          :auto-upload="false"
          accept=".zip"
          :file-list="data.filelist"
          :on-change="handleChange"
        >
          <template #trigger>
            <el-button type="primary" size="large">选择模型上传</el-button>
          </template>
        </el-upload>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clearForm" size="large">取消</el-button>
        <el-button type="primary" @click="submitData" size="large"> 完成 </el-button>
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
import { ElNotification, ElMessage } from 'element-plus'
import { reactive, toRefs, onMounted, watch, computed } from 'vue'
import store from '@/store'
import { getConfigList, postTolerantConfig, getCalData, uploadFile } from '@/api/business/data'
const data = reactive({
  recordData: [],
  formdata: {
    modelName: '',
    policyName: '',
    count: 0,
    selectIp: []
  },
  filelist: [],
  nodeList: [],
  tempFilesInfo: [],
  status: ['success', 'info', 'warning'],
  nodeCurrentPage: 1,
  nodePageTotal: 50,
  nodePageSize: 10,
  selectItem: [{ mode: 'exactly' }, { mode: 'all' }, { mode: 'nodes' }],
  currentSelectItem: '',
  arrangeVisible: false,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500
})

onMounted(() => {
  getDataList()
})
//get data from interface
const getDataList = () => {
  let params = {
    asc: false,
    page: 1,
    pageSize: 10,
    searchText: 'string',
    sortField: 'createTime'
  }
  getConfigList(params).then((res) => {
    if (res.code == 200) {
      store.commit('cleanproxyListInfo')
      store.commit('setproxyListInfo', res.data.list)
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

watch(
  () => data.nodeCurrentPage,
  (state) => {
    getConfigNodeList()
  }
)

// dataState
const dataState = computed(() => (status) => {
  if (status == 'online') {
    return data.status[0]
  } else if (status == 'offline') {
    return data.status[1]
  } else {
    return data.status[2]
  }
})

//load Data
const loadList = () => {
  data.recordData.length = 0
  store.state.tolerantProxyInfo.dataList.forEach((item) => {
    data.recordData.push(item)
  })
}

const clearForm = () => {
  data.formdata.modelName = ''
  data.formdata.policyName = ''
  data.currentSelectItem = ''
  data.filelist.length = 0
  data.tempFilesInfo.length = 0
  data.formdata.selectIp = 0
  data.formdata.count = 0
  data.arrangeVisible = false
}

// 上传文件
const handleChange = (file, fileList) => {
  data.filelist.length = 0
  data.filelist = fileList
}

const delolyClick = () => {
  data.arrangeVisible = true
  getConfigNodeList()
}

//getnodeList
const getConfigNodeList = () => {
  let params = {
    asc: false,
    page: data.nodeCurrentPage,
    pageSize: data.nodePageSize,
    searchText: 'string',
    sortField: 'createTime'
  }
  getCalData(params).then((res) => {
    if (res.code == 200) {
      store.commit('cleanCalListInfo')
      store.commit('setcalListInfo', res.data.list)
      data.nodePageTotal = Number(res.data.total)
      data.nodeList.length = 0
      store.state.calListInfo.dataList.forEach((item) => {
        data.nodeList.push(item)
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

const submitData = () => {
  if (data.filelist.length) {
    let file = ''
    file = data.filelist[0].raw
    let formdata = new FormData()
    formdata.append('modelName', data.formdata.modelName)
    formdata.append('policyName', data.formdata.policyName)
    formdata.append('haMode', data.currentSelectItem)
    if (data.currentSelectItem == 'exactly') {
      formdata.append('count', data.formdata.count)
    }
    if (data.currentSelectItem == 'nodes') {
      formdata.append('targetIp', data.formdata.selectIp)
    }
    formdata.append('file', file)
    postTolerantConfig(formdata).then((res) => {
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

//selectChange
const selectChange = () => {
  if (data.currentSelectItem == 'exactly') {
    data.formdata.selectIp.length = 0
  }
  if (data.currentSelectItem == 'all') {
    data.formdata.selectIp.length = 0
    data.formdata.count = 0
  }
  if (data.currentSelectItem == 'nodes') {
    data.formdata.count = 0
  }
}

//nodeSelect
const nodeSelect = (items) => {
  data.formdata.selectIp.length = 0
  items.forEach((item) => {
    data.formdata.selectIp.push(item.ip)
  })
}

const isUndefined = computed(() => (p, attr) => {
  if (p == null) {
    return null
  } else {
    // console.log(p[attr])
    return p[attr]
  }
})

//pagination
const handleSizeChange = () => {
  getDataList()
}

const handleCurrentChange = () => {
  getDataList()
}
</script>

<style scoped>
/* Button business */
.configInfo-title {
  display: flex;
  height: 3rem;
  padding: 1rem;
  justify-content: space-between;
}
.configInfo-title-name {
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

.configInfo-table {
  display: flex;
  justify-content: center;
}
.el-table {
  /* font-weight: bold;
    color: black; */
  max-width: 100%;
  width: 10rem;
  font-size: 1rem;
}
:deep(.el-table__header-wrapper) {
  display: flex !important;
  justify-content: center !important;
}
:deep(.el-table__header) {
  width: 100% !important;
}
:deep(.el-scrollbar__wrap) {
  display: flex !important;
  justify-content: center !important;
}
:deep(.el-table__body) {
  width: 100% !important;
}
:deep(.firstCol) {
  font-weight: bold !important;
}
.textKey {
  font-weight: bold;
  font-size: 0.9rem;
}
.textValue {
  font-size: 0.9rem;
}
.deployedInfo-table-nodeInfo-popper {
  line-height: unset !important;
  width: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.deployedInfo-table-nodeInfo-li {
  /* line-height: unset !important; */
  /* margin: 0.5rem; */
  /* font-size: 1.2rem; */
  list-style-type: none;
}
:deep(.targetIp .el-form-item__content) {
  align-items: unset !important;
  flex-direction: column;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
