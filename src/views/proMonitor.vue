<template>
  <div class="monitorInfo-title">
    <div class="monitorInfo-title-name">部署流程列表</div>
    <div class="monitorInfo-title-search">
      <el-input v-model="data.input" size="large" placeholder="请输入模型名称" />
      <el-button type="success" size="large" :icon="Search">搜索</el-button>
    </div>
    <div text="Placeholder"></div>
  </div>
  <div class="monitorInfo-table">
    <el-table
      :data="data.monitorInfoData"
      size="large"
      stripe
      height="45rem"
      width="50"
      max-height="80rem"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        textAlign: 'center'
      }"
      row-class-name="monitorInfo-table-rows"
    >
      <el-table-column prop="id" label="部署流程ID" width="150" />
      <el-table-column prop="modelName" class-name="firstCol" label="模型名称" width="100" />
      <el-table-column prop="targetIp" label="目标节点" width="100" />
      <el-table-column prop="createTime" label="开始时间" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag
            :type="dataState(scope.row.status)"
            size="large"
            class="nodeStatusText"
            effect="light"
            >{{ scope.row.status }}</el-tag
          >
        </template></el-table-column
      >
      <el-table-column prop="updateTime" label="更新时间" width="150"> </el-table-column>
      <!-- <el-table-column label="操作" width="80">
        <template #default="scope">
          <el-button type="primary" plain>操作</el-button>
        </template></el-table-column
      > -->
    </el-table>
  </div>
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
import { onMounted, reactive, toRefs, computed } from 'vue'
import store from '@/store'
import { getDeployList } from '@/api/business/data'
import $ from 'jquery'
const data = reactive({
  monitorInfoData: [],
  input: '',
  status: ['success', 'info', 'warning', 'danger'],
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500
})

//self start
onMounted(() => {
  getDataList()
})
const test = () => {
  let params = {
    asc: false,
    page: 1,
    pageSize: 10,
    searchText: 'string',
    sortField: 'createTime'
  }
  console.log(params)
  getDeployList(params).then((res) => {
    console.log(res)
  })
}

//get data from interface
const getDataList = () => {
  let params = {
    asc: false,
    page: data.currentPage,
    pageSize: data.pageSize,
    searchText: 'string',
    sortField: 'createTime'
  }
  getDeployList(params).then((res) => {
    if (res.code == 200) {
      console.log(res.data.list)
      store.commit('cleanmonitorListInfo')
      store.commit('setmonitorListInfo', res.data.list)
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
  data.monitorInfoData.length = 0
  store.state.proMonitorInfo.dataList.forEach((item) => {
    data.monitorInfoData.push(item)
  })
}
const dataState = computed(() => (status) => {
  if (status == 'FINISHED') {
    return data.status[0]
  } else if (status == 'INIT') {
    return data.status[1]
  } else if (status == 'DEPLOYING') {
    return data.status[2]
  } else if (status == 'FAILED') {
    return data.status[3]
  }
})

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
.monitorInfo-title {
  display: flex;
  height: 3rem;
  padding: 1rem;
  justify-content: space-between;
}
.monitorInfo-title-name {
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

.monitorInfo-table {
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
:deep(.monitorInfo-table-rows) {
  line-height: 2rem;
}
.nodeStatusText {
  font-size: 1rem;
  font-weight: bold;
}
.monitorInfo-table-nodeInfo-li {
  list-style-type: none;
}
.el-link {
  font-size: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
<style>
.monitorInfo-table-nodeInfo-popper {
  line-height: unset !important;
  width: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
