<template>
  <div class="calInfo-title">
    <div class="calInfo-title-name">计算资源信息</div>
    <div class="calInfo-title-search">
      <el-input v-model="data.input" size="large" placeholder="请输入节点Ip" />
      <el-button type="success" size="large" :icon="Search">搜索</el-button>
    </div>
    <div>
      <el-button type="primary" size="large" @click="modeRefresh">刷新</el-button>
    </div>
  </div>
  <div class="calInfo-table">
    <el-table
      :data="data.calInfoData"
      size="large"
      stripe
      height="45rem"
      max-height="45rem"
      width="50"
      style="width: 100%"
      row-class-name="calInfo-table-rows"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        textAlign: 'center'
      }"
    >
      <el-table-column prop="ip" class-name="firstCol" label="节点ip" width="180" />
      <el-table-column prop="status" label="状态" width="180">
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
      <el-table-column prop="server" sortable label="主机信息" width="180">
        <template #default="scope">
          <el-space direction="vertical">
            <el-text class="textValue"
              ><el-text class="textKey">主机名:&nbsp;&nbsp;</el-text>
              {{ isUndefined(scope.row.server, 'hostname') }}
            </el-text>
            <el-text class="textValue"
              ><el-text class="textKey">系统类型:&nbsp;&nbsp;</el-text
              >{{ isUndefined(scope.row.server, 'systemType') }}</el-text
            >
            <el-text class="textValue"
              ><el-text class="textKey">平台:&nbsp;&nbsp;</el-text
              >{{ isUndefined(scope.row.server, 'platform') }} &nbsp;&nbsp;&nbsp;&nbsp;
              <el-text class="textKey">cpu数量:&nbsp;&nbsp;</el-text
              >{{ isUndefined(scope.row.server, 'cpuNum') }}</el-text
            >
            <el-text class="textValue"
              ><el-text class="textKey">版本号:&nbsp;&nbsp;</el-text
              >{{ isUndefined(scope.row.server, 'release') }}</el-text
            >
          </el-space>
        </template></el-table-column
      >
      <el-table-column prop="server" label="cpu利用率" width="180">
        <template #default="scope">
          <el-space direction="vertical" style="gap: unset">
            <div class="demo-progress">
              <el-progress
                type="dashboard"
                :width="90"
                :color="data.colors"
                :percentage="
                  isUndefined(scope.row.server, 'cpuUsage') == null
                    ? 0
                    : isUndefined(scope.row.server, 'cpuUsage')
                "
              />
            </div>
          </el-space> </template
      ></el-table-column>
      <el-table-column prop="server" label="内存信息" width="180">
        <template #default="scope">
          <el-space direction="vertical" style="gap: unset">
            <div class="demo-progress">
              <el-progress
                type="dashboard"
                :width="80"
                :color="data.colors"
                :percentage="
                  isUndefined(scope.row.server, 'usageMem') == null
                    ? 0
                    : isUndefined(scope.row.server, 'usageMem')
                "
              />
            </div>
            <el-text class="textKey">{{
              scope.row.server == null
                ? 'null'
                : serverSize(scope.row.server.freeMem, scope.row.server.totalMem) +
                  '/' +
                  isUndefined(scope.row.server, 'totalMem')
            }}</el-text>
          </el-space>
        </template></el-table-column
      >

      <el-table-column prop="disk" label="磁盘信息" width="180">
        <template #default="scope">
          <el-space direction="vertical" style="gap: unset">
            <div class="demo-progress">
              <el-progress
                type="dashboard"
                :width="75"
                :color="data.colors"
                :percentage="isUndefined(scope.row.server, 'usageDisk')"
              />
            </div>
            <el-text class="textKey">{{
              scope.row.server == null
                ? 'null'
                : serverSize(scope.row.server.freeDisk, scope.row.server.totalDisk) +
                  '/' +
                  isUndefined(scope.row.server, 'totalDisk')
            }}</el-text>
            <!-- <el-text class="textKey">{{
              '路径:' + isUndefined(scope.row.server, 'processDisk')
            }}</el-text> -->
          </el-space>
        </template></el-table-column
      >
      <el-table-column prop="label" label="标签" width="180"
        ><template #default="scope">
          <el-button type="primary" @click="attrTag(scope.row.labels, scope.row.id)" size="default"
            >查看</el-button
          ></template
        ></el-table-column
      >
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
  <!-- -->
  <el-dialog
    v-model="data.DialogVisible"
    :close-on-click-modal="false"
    title="属性"
    width="700"
    center
    @close="closeTag()"
  >
    <div class="calInfoDialog">
      <div class="calInfoDialog-button">
        <el-button
          type="primary"
          class="calInfoDialog-button-edit"
          size="large"
          :disabled="editButtonState"
          @click="tagEditOrSave"
          >编辑</el-button
        >
        <el-button
          type="success"
          :disabled="data.addDisabled"
          class="calInfoDialog-button-add"
          size="large"
          @click="tagAdd"
          >添加</el-button
        >
        <el-button
          type="danger"
          :disabled="data.addDisabled || editButtonState"
          class="calInfoDialog-button-delete"
          size="large"
          @click="deleteLabel"
          >删除</el-button
        >
      </div>
      <div class="calInfoDialog-form">
        <el-scrollbar height="400px">
          <el-radio-group v-model="data.checkedInput" :disabled="data.radioDisabled">
            <el-form :key="item" v-for="(item, index) in data.labels">
              <el-form-item>
                <el-radio :label="index">
                  <el-text class="textKey" style="font-size: 1.2rem">key:&nbsp;</el-text>
                  <el-input
                    disabled="true"
                    class="calInfoDialog-form-input"
                    v-model="item.key"
                    style="font-size: 1.2rem" />
                  <el-text class="textKey" style="font-size: 1.2rem">value: &nbsp;</el-text>
                  <el-input
                    style="font-size: 1.2rem"
                    :disabled="inputAbled(index)"
                    class="calInfoDialog-form-input"
                    v-model="item.value"
                    :input="getEditlabel(index, item.key, item.value)"
                /></el-radio>
              </el-form-item>
            </el-form>
          </el-radio-group>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog v-model="data.innerVisible" width="500" title="添加标签" append-to-body center>
      <el-space direction="vertical" style="gap: unset; width: 100%">
        <div class="calInfoDialog-form-add">
          <el-text class="textKey">key: &nbsp;</el-text>
          <el-input class="calInfoDialog-form-input-add" v-model="data.addLabel.key" />
          <el-text class="textKey">value: &nbsp;</el-text>
          <el-input class="calInfoDialog-form-input-add" v-model="data.addLabel.value" />
        </div>
        <div class="calInfoDialog-form-addButton">
          <el-button type="primary" size="large" @click="addTag">添加</el-button>
        </div></el-space
      >
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
import store from '@/store'
import { ElNotification, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { getCalData, dataOperate, modeRefresh } from '@/api/business/data'
import calInfoTag from '@/views/calInfoPages/calInfoTag.vue'
import $ from 'jquery'
import { timePanelSharedProps } from 'element-plus/es/components/time-picker/src/props/shared'
const data = reactive({
  calInfoData: [],
  status: ['success', 'info', 'warning'],
  input: '',
  DialogVisible: false,
  innerVisible: false,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  pageTotal: 50,
  labels: [],
  checkedInput: 9999,
  editIndex: 6666,
  radioDisabled: false,
  addDisabled: false,
  addLabel: { key: '', value: '' },
  currentId: '',
  currentEditLabel: { key: '', value: '' },
  colors: [
    { color: '#67C23A', percentage: 50 },
    { color: '#E6A23C', percentage: 80 },
    { color: '#F56C6C', percentage: 100 }
  ]
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
  getCalData(params).then((res) => {
    if (res.code == 200) {
      data.pageTotal = Number(res.data.total)
      store.commit('cleanCalListInfo')
      store.commit('setcalListInfo', res.data.list)
      // data.pageTotal = res.data.total
      loadList()
    } else {
      ElNotification({
        title: 'Error',
        message: res.message,
        type: 'error'
      })
    }
  })
}

//
watch(
  () => data.innerVisible,
  (state) => {
    if (state == true) {
      data.addLabel.key = ''
      data.addLabel.value = ''
    }
  }
)

const editButtonState = computed(() => {
  if (data.checkedInput == 9999) {
    //如果是未选择状态，则编辑按钮不开
    return true
  } else {
    // console.log(p[attr])
    return false
  }
})

const serverSize = computed(() => (freeSize, totalSize) => {
  let usedSize
  if (freeSize.slice(-2) == totalSize.slice(-2)) {
    usedSize = (parseFloat(totalSize) - parseFloat(freeSize)).toFixed(1)
    return usedSize + freeSize.slice(-2)
  } else {
    if (freeSize.slice(-2) == 'MB') {
      usedSize = (parseFloat(totalSize) * 1024 - parseFloat(freeSize)).toFixed(1)
      if (usedSize >= 1024) {
        usedSize = (usedSize / 1024).toFixed(1)
        return usedSize + totalSize.slice(-2)
      } else {
        return usedSize + freeSize.slice(-2)
      }
    } else if (freeSize.slice(-2) == 'KB') {
      usedSize = (parseFloat(totalSize) * 1024 * 1024 - parseFloat(freeSize)).toFixed(1)
      if (usedSize >= 1024 * 1024) {
        usedSize = (usedSize / 1024 / 1024).toFixed(1)
        return usedSize + totalSize.slice(-2)
      } else if (usedSize >= 1024) {
        return usedSize + 'MB'
      } else {
        return usedSize + freeSize.slice(-2)
      }
    }
  }

  return usedSize
})

const isUndefined = computed(() => (p, attr) => {
  if (p == null) {
    return null
  } else {
    // console.log(p[attr])
    return p[attr]
  }
})
const inputAbled = computed(() => (index) => {
  if (index == data.editIndex) {
    return false
  } else {
    return true
  }
})
//临时修改
const editcalList = (type, label) => {
  if (type == 1) {
    data.labels.push(label)
  } else if (type == 2) {
    data.labels[label.key] = label.value
  } else if (type == 3) {
    for (var i = 0; i < data.labels.length; i++) {
      // data.labels.splice(i, 1)
      if (data.labels[i].key == label.key) {
        // data.labels.splice(i, 1)
      }
    }
  }
}

const getEditlabel = (index, key, value) => {
  if (index == data.checkedInput) {
    data.currentEditLabel.key = key
    data.currentEditLabel.value = value
  }
}

const tagEditOrSave = () => {
  if (data.checkedInput != 9999) {
    if ($('.calInfoDialog-button-edit').text() == '编辑') {
      data.editIndex = data.checkedInput
      // data.checkedInput = 8888
      //编辑状态关闭选项框
      data.radioDisabled = true
      //编辑状态关闭添加功能
      data.addDisabled = true
      $('.calInfoDialog-button-edit').text('保存')
    } else if ($('.calInfoDialog-button-edit').text() == '保存') {
      data.checkedInput = 9999
      data.editIndex = 6666
      //提交编辑内容
      editLabel()
      $('.calInfoDialog-button-edit').text('编辑')
    }
  }
}
const deleteLabel = () => {
  if (data.checkedInput != 9999) {
    let label = {
      key: data.currentEditLabel.key,
      value: data.currentEditLabel.value
    }
    let params = {
      id: data.currentId,
      label: label,
      type: 3
    }
    dataOperate(params).then((res) => {
      if (res.code == 200) {
        ElNotification({
          title: 'Success',
          message: '数据修改成功！',
          type: 'success'
        })
        editcalList(3, label)
        data.checkedInput = 9999
      } else {
        ElNotification({
          title: 'Error',
          message: res.msg,
          type: 'success'
        })
      }
    })
  }
}
//
const editLabel = () => {
  if (data.currentEditLabel.value == '') {
    ElMessage.warning('属性不可为空!')
  } else {
    let label = {
      key: data.currentEditLabel.key,
      value: data.currentEditLabel.value
    }
    let params = {
      id: data.currentId,
      label: label,
      type: 2
    }
    dataOperate(params).then((res) => {
      if (res.code == 200) {
        ElNotification({
          title: 'Success',
          message: '数据修改成功！',
          type: 'success'
        })
      } else {
        ElNotification({
          title: 'Error',
          message: res.msg,
          type: 'success'
        })
      }
    })
  }
}
//add data
const addTag = () => {
  if (data.addLabel.key == '' || data.addLabel.value == '') {
    ElMessage.warning('添加标签不可为空!')
  } else {
    let label = {
      key: data.addLabel.key,
      value: data.addLabel.value
    }
    let params = {
      id: data.currentId,
      label: label,
      type: 1
    }
    dataOperate(params).then((res) => {
      if (res.code == 200) {
        ElNotification({
          title: 'Success',
          message: '数据添加成功！',
          type: 'success'
        })
        editcalList(1, label)
      } else {
        ElNotification({
          title: 'Error',
          message: res.msg,
          type: 'success'
        })
      }
      data.innerVisible = false
    })
  }
}
const closeTag = () => {
  //checkbox->9999
  data.checkedInput = 9999
  data.editIndex = 6666
  data.addLabel.key = ''
  data.addLabel.value = ''
  data.currentEditLabel.key = ''
  data.currentEditLabel.value = ''
  data.currentId = ''
  //close check
  data.radioDisabled = false
  data.addDisabled = false
  getDataList()
}

const getIndex = (index) => {
  console.log(index)
  return index
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
// progress
const progressState = computed(() => (state) => {
  if (state <= 50) {
    return 'success'
  } else if (state > 50 && state <= 80) {
    return 'warning'
  } else {
    return 'exception'
  }
})

//load Data
const loadList = () => {
  data.calInfoData.length = 0
  store.state.calListInfo.dataList.forEach((item) => {
    data.calInfoData.push(item)
  })
}

//tag attrs details
const attrTag = (labels, id) => {
  if (labels == null) {
    return null
  } else {
    data.DialogVisible = true
    data.labels.length = 0
    data.currentId = id
    labels.forEach((item) => {
      data.labels.push(item)
    })
  }
}

const tagAdd = () => {
  data.innerVisible = true
}
//tagEditOrAdit
// const tagEditOrAdd = () => {}

//pagination
const handleSizeChange = () => {
  // console.log('1')
  getDataList()
  // $('.el-select__selected-item').text(data.pageSize + '条/页')
  // console.log(`${val} items per page`)
}

const handleCurrentChange = () => {
  // console.log(data.currentPage)
  getDataList()
  // console.log(`current page: ${val}`)
}
</script>

<style scoped>
/* Button business */
.calInfo-title {
  display: flex;
  height: 3rem;
  padding: 1rem;
  justify-content: space-between;
}
.calInfo-title-name {
  font-weight: bold;
  font-size: 1.5rem;
  /* margin-right: 5rem; */
}
.el-input {
  width: 50rem;
  margin-right: 1rem;
}
.calInfo-table {
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
:deep(.calInfo-table .el-scrollbar__wrap) {
  display: flex !important;
  justify-content: center !important;
}
:deep(.el-table__body) {
  width: 100% !important;
}
:deep(.firstCol) {
  font-weight: bold !important;
}
:deep(.calInfo-table-rows) {
  line-height: 2rem;
}
.nodeStatusText {
  font-size: 1rem;
  font-weight: bold;
}
.textKey {
  font-weight: bold;
  font-size: 0.9rem;
}
.textValue {
  font-size: 0.9rem;
}
.demo-progress .el-progress--circle {
  margin-right: 1rem;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.calInfoDialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* background-color: brown; */
}
.calInfoDialog-button {
  padding: 1rem;
  display: flex;
  justify-content: center;
}
.calInfoDialog-form {
  width: 100%;
}
:deep(.el-form-item__content) {
  right: 0rem;
}
:deep(.el-form-item__content .el-radio) {
  /* margin-right: 1rem; */
  justify-content: center;
}
:deep(.el-radio__input) {
  margin-right: 1.5rem;
}
:deep(.el-scrollbar__view) {
  display: flex;
  justify-content: center;
}
.calInfoDialog-form-input {
  width: 15rem;
  background: none;
  outline: none;
  border: none;
}
:deep(.el-input__inner) {
  background: none;
  outline: none;
  border: none;
}
.calInfoDialog-form-input-add {
  width: 10rem;
  outline: 1px;
  border: none;
}
.calInfoDialog-form-add {
  margin-bottom: 1.5rem;
}
/* :deep(.el-form-item__content .calInfoDialog-form-input:first) {
  text-align: right;
} */
:deep(.calInfoDialog-form-input .el-input__wrapper) {
  background-color: unset !important;
  box-shadow: unset !important;
  background: none;
  outline: none;
  border: none;
  box-shadow: none;
}
</style>
