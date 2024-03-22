<template>
  <div class="shootInfoInfo-title">
    <div class="shootInfoInfo-title-name">容错处理记录</div>
    <div class="shootInfoInfo-title-search">
      <el-input v-model="data.input" size="large" placeholder="请输入模型名称" />
      <el-button type="success" size="large" :icon="Search">搜索</el-button>
    </div>
    <div text="Placeholder"></div>
  </div>
  <div class="shootInfoInfo-table">
    <el-table
      :data="data.recordData"
      size="large"
      stripe
      :table-layout="fixed"
      height="45rem"
      width="50"
      max-height="80rem"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        textAlign: 'center'
      }"
    >
      <el-table-column prop="modelName" class-name="firstCol" label="模型名称" width="180" />
      <el-table-column prop="originIp" label="原始节点" width="180">
        <template #default="scope">
          <el-text
            style="font-size: 1rem; margin-top: 0.5rem"
            :key="item"
            v-for="item in scope.row.originIp"
            >{{ item }} <br
          /></el-text>
        </template>
      </el-table-column>
      <el-table-column prop="targetIp" label="处理节点" width="180">
        <template #default="scope">
          <el-text
            style="font-size: 1rem; margin-top: 0.5rem"
            :key="item"
            v-for="item in scope.row.targetIp"
            >{{ item }} <br
          /></el-text>
        </template>
      </el-table-column>
      <el-table-column prop="nodeInfo" label="关联流程" width="180">
        <template #default="scope">
          <el-text
            style="font-size: 1rem; margin-top: 0.5rem"
            :key="item"
            v-for="(item, index) in scope.row.deployId"
          >
            <el-tag
              type="info"
              size="large"
              @click="tagInfo(scope.row.deployId[index])"
              class="nodeStatusText"
              effect="light"
              style="cursor: pointer; margin: 0.2rem 0"
              >{{ item }}</el-tag
            ><br
          /></el-text>
          <!-- <el-tooltip placement="bottom">
            <template #content> multiple lines<br />second line </template>
            <el-button>Top center</el-button>
          </el-tooltip> -->
        </template></el-table-column
      >
      <el-table-column prop="createTime" label="创建时间" width="180" />
    </el-table>
  </div>
  <el-dialog
    v-model="data.arrangeVisible"
    title="详细信息"
    width="25%"
    top
    center
    :close="closeTag()"
  >
    <div v-if="data.tagInfo.id != null" style="display: flex; justify-content: center">
      <el-space direction="vertical">
        <div style="width: 18rem; display: flex">
          <el-text class="textKey" style="width: 6rem; text-align: right"
            >部署流程ID :&nbsp;&nbsp;</el-text
          >
          <div>
            <el-text style="font-size: 1rem">{{ data.tagInfo.id }}</el-text>
          </div>
        </div>
        <div v-if="data.tagInfo.modelName != null" style="width: 18rem; display: flex">
          <el-text class="textKey" style="width: 6rem; text-align: right"
            >模型名称 :&nbsp;&nbsp;</el-text
          >
          <div>
            <el-text style="font-size: 1rem">{{ data.tagInfo.modelName }}</el-text>
          </div>
        </div>
        <div v-if="data.tagInfo.targetIp != null" style="width: 18rem; display: flex">
          <el-text class="textKey" style="width: 6rem; text-align: right"
            >目标节点 :&nbsp;&nbsp;</el-text
          >
          <div>
            <el-text style="font-size: 1rem">{{ data.tagInfo.targetIp }}</el-text>
          </div>
        </div>
        <div v-if="data.tagInfo.createTime != null" style="width: 18rem; display: flex">
          <el-text class="textKey" style="width: 6rem; text-align: right"
            >开始时间 :&nbsp;&nbsp;</el-text
          >
          <div>
            <el-text style="font-size: 1rem">{{ data.tagInfo.createTime }}</el-text>
          </div>
        </div>
        <div v-if="data.tagInfo.status != null" style="width: 18rem; display: flex">
          <el-text style="width: 6rem; text-align: right" class="textKey"
            >状态 :&nbsp;&nbsp;</el-text
          >
          <div>
            <el-text style="font-size: 1rem">{{ data.tagInfo.status }}</el-text>
          </div>
        </div>
        <div v-if="data.tagInfo.updateTime != null" style="width: 18rem; display: flex">
          <el-text style="width: 6rem; text-align: right" class="textKey"
            >更新时间 :&nbsp;&nbsp;</el-text
          >
          <div>
            <el-text style="font-size: 1rem">{{ data.tagInfo.updateTime }}</el-text>
          </div>
        </div>
      </el-space>
    </div>
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
import { reactive, toRefs, onMounted, computed } from 'vue'
import store from '@/store'
import { getTolerantRecord, deployInfo } from '@/api/business/data'
const data = reactive({
  recordData: [],
  input: '',
  currentPage: 1,
  arrangeVisible: false,
  tagInfo: [],
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500
})

const isUndefined = computed(() => (p, attr) => {
  if (p == null) {
    return null
  } else {
    return p[attr]
  }
})

//self start
onMounted(() => {
  getDataList()
})

//get data from interface
const getDataList = () => {
  let params = {
    asc: false,
    page: data.currentPage,
    pageSize: data.pageSize,
    searchText: 'string',
    sortField: 'createTime'
  }
  getTolerantRecord(params).then((res) => {
    if (res.code == 200) {
      console.log(res.data)
      store.commit('cleanrecordListInfo')
      store.commit('setrecordListInfo', res.data.list)
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
  data.recordData.length = 0
  store.state.troubleshootInfo.dataList.forEach((item) => {
    data.recordData.push(item)
  })
}
const tagInfo = (deployId) => {
  deployInfo(deployId).then((res) => {
    if (res.code == 200) {
      data.tagInfo = res.data
    } else {
      ElNotification({
        title: 'Error',
        message: res.msg,
        type: 'error'
      })
    }
  })
  data.arrangeVisible = true
}
const closeTag = () => {
  data.tagInfo.length = 0
}
const handleSizeChange = () => {
  getDataList()
}

const handleCurrentChange = () => {
  getDataList()
}
</script>

<style scoped>
/* Button business */
.shootInfoInfo-title {
  display: flex;
  height: 3rem;
  padding: 1rem;
  justify-content: space-between;
}
.shootInfoInfo-title-name {
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

.shootInfo-table {
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
.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
