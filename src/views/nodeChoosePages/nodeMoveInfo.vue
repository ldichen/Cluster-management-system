<template>
  <div class="nodeInfo-table">
    <el-table
      :data="props.nodeInfo"
      size="large"
      stripe
      :table-layout="fixed"
      height="40rem"
      max-height="40rem"
      style="width: 25rem"
      :cell-style="{ textAlign: 'center', border: '1px solid #dedfe0' }"
      :header-cell-style="{
        textAlign: 'center',
        'background-color': 'rgb(235, 243, 251)',
        border: '1px solid #dedfe0'
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="10" />
      <el-table-column prop="node.ip" class-name="firstCol" label="节点列表" width="50" />
      <el-table-column prop="node.score" class-name="firstCol" label="得分" width="20" />
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { ElNotification } from 'element-plus'
import store from '@/store'
const emit = defineEmits(['selectNodeInfo'])
const props = defineProps(['nodeInfo'])
const data = reactive({
  selectNodeData: [],
  input: '',
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 500
})
onMounted(() => {})

const handleSelectionChange = (selectItem) => {
  data.selectNodeData.length = 0
  selectItem.forEach((item) => {
    data.selectNodeData.push(item)
  })
  emit('selectNodeInfo', data.selectNodeData)
}
</script>
<style scoped>
.nodeInfo-table {
  margin-top: 5rem;
  display: flex;
  max-width: 50rem;
  justify-content: center;
  margin-right: 2rem;
  margin-left: 2rem;
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
</style>
