<template>
  <div class="modelInfo-title">
    <div class="modelInfo-title-name">模型资源信息</div>
    <div class="modelInfo-title-search">
      <el-input v-model="data.input" size="large" placeholder="请输入模型名称" />
      <el-button type="success" size="large" :icon="Search">搜索</el-button>
    </div>
    <div text="Placeholder"></div>
  </div>
  <div class="modelInfo-table">
    <el-table
      :data="data.modelInfoData"
      size="large"
      stripe
      height="45rem"
      width="50"
      max-height="80rem"
      style="width: 100%"
      row-class-name="modelInfo-table-rows"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        textAlign: 'center'
      }"
    >
      <el-table-column prop="name" class-name="firstCol" label="模型名称" width="180" />
      <el-table-column prop="md5" label="md5" width="180" />
      <el-table-column prop="author" label="作者" width="80" />
      <el-table-column prop="createTime" sortable label="创建时间" width="150" />
      <el-table-column prop="deployedMSR" label="节点信息" width="80">
        <template #default="scope">
          <el-tooltip
            placement="bottom"
            effect="light"
            popper-class="modelInfo-table-nodeInfo-popper"
          >
            <template #content>
              <div style="margin: 0.5rem 0">
                <div style="font-size: 1.1rem">服务器地址 (点击前往) :</div>
                <li
                  class="modelInfo-table-nodeInfo-li"
                  :key="item"
                  v-for="item in scope.row.deployedMSR.length > 0 ? scope.row.deployedMSR : ['无']"
                >
                  <el-link type="primary" style="font-size: 1.2rem; margin-top: 0.5rem">{{
                    item
                  }}</el-link>
                </li>
              </div>
            </template>
            <el-button>查看节点</el-button>
          </el-tooltip>
        </template></el-table-column
      >
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <el-button type="primary" size="default" plain style="margin-bottom: 0.5rem"
              >下载部署包</el-button
            >
            <el-button type="success" size="default" plain @click="delolyClick(scope.row)"
              >创建容错规则</el-button
            >
          </div>
        </template></el-table-column
      >
    </el-table>
  </div>
  <el-dialog
    v-model="data.arrangeVisible"
    title="配置模型"
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
            height="13.6rem"
            max-height="13.6rem"
            @selection-change="nodeSelect"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{
              textAlign: 'center'
            }"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column property="ip" label="节点" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="dataState(scope.row.status)" class="nodeStatusText" effect="light">{{
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
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clearForm" size="large" style="margin-right: 0.5rem">取消</el-button>
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
import { ElNotification } from 'element-plus'
import { onMounted, reactive, toRefs, computed, watch } from 'vue'
import store from '@/store'
import { getModelData, postTolerantConfig, getCalData } from '@/api/business/data'
import $ from 'jquery'
const data = reactive({
  modelInfoData: [],
  input: '',
  arrangeVisible: false,
  formdata: {
    modelName: '',
    policyName: '',
    md5: '',
    count: 0,
    selectIp: []
  },
  selectItem: [{ mode: 'exactly' }, { mode: 'all' }, { mode: 'nodes' }],
  currentSelectItem: '',
  nodeList: [],
  status: ['success', 'info', 'warning'],
  nodeCurrentPage: 1,
  nodePageTotal: 50,
  nodePageSize: 10,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500
})

//self start
onMounted(() => {
  // $('.el-pagination__total').text('共 ' + data.pageTotal + ' 条')
  // $('.el-select__selected-item').text(data.pageSize + '条/页')
  // $('.el-pagination__goto').text('前往')
  // $('.el-pagination__classifier').text('页')
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
    // console.log(item)
  })
  // console.log(data.modelInfoData)
}

watch(
  () => data.nodeCurrentPage,
  (state) => {
    getConfigNodeList()
  }
)

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
      console.log(data.nodeList)
    } else {
      ElNotification({
        title: 'Error',
        message: res.message,
        type: 'error'
      })
    }
  })
}
const delolyClick = (info) => {
  data.arrangeVisible = true
  getConfigNodeList()
  data.formdata.modelName = info.name
  data.formdata.md5 = info.md5
}

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

const clearForm = () => {
  data.formdata.modelName = ''
  data.formdata.policyName = ''
  data.formdata.md5 = ''
  data.currentSelectItem = ''
  data.formdata.selectIp = 0
  data.formdata.count = 0
  data.arrangeVisible = false
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

const submitData = () => {
  let formdata = new FormData()
  formdata.append('modelName', data.formdata.modelName)
  formdata.append('policyName', data.formdata.policyName)
  formdata.append('haMode', data.currentSelectItem)
  formdata.append('modelMd5', data.formdata.md5)
  if (data.currentSelectItem == 'exactly') {
    formdata.append('count', data.formdata.count)
  }
  if (data.currentSelectItem == 'nodes') {
    formdata.append('targetIp', data.formdata.selectIp)
  }
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
}

//pagination
const handleSizeChange = () => {
  getDataList()
  // console.log(data.pageSize)
  // $('.el-select__selected-item').text(data.pageSize + '条/页')
  // console.log(`${val} items per page`)
}

const handleCurrentChange = () => {
  getDataList()
  // console.log(data.currentPage)
  // console.log(`current page: ${val}`)
}
</script>

<style scoped>
/* Button business */
.modelInfo-title {
  display: flex;
  height: 3rem;
  padding: 1rem;
  justify-content: space-between;
}
.modelInfo-title-name {
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

.modelInfo-table {
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
:deep(.modelInfo-table-rows) {
  line-height: 2rem;
}
.modelInfo-table-nodeInfo-li {
  margin-top: 0.2rem;
  font-size: 1.2rem;
  list-style-type: none;
}
:deep(.el-button + .el-button) {
  margin-left: unset !important;
}
.el-link {
  font-size: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
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
/* :deep(.el-select__selected-item) {
  background-color: blue;
} */
</style>
<style>
.modelInfo-table-nodeInfo-popper {
  line-height: unset !important;
  width: 13rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.nodeStatusText {
  font-size: 1rem;
  font-weight: bold;
}
</style>
