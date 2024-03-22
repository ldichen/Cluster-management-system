<template>
  <div class="calInfoTag">
    <div class="calInfoTag-button">
      <el-button type="primary" size="large">编辑</el-button>
      <el-button type="success" size="large">添加</el-button>
    </div>
    <div class="calInfoTag-form"></div>
    <div class="calInfoTag-save" v-show="data.saveShow">
      <el-button type="success" size="large">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, onMounted } from 'vue'
const props = defineProps(['attr'])
const data = reactive({
  saveShow: false
})
//self start
onMounted(() => {})

//load data
const loadList = () => {}
</script>

<style scoped>
.calInfoTag {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  background-color: brown;
  width: 30rem;
  height: 20rem;
}
.calInfoTag-button {
  padding: 1rem;
  display: flex;
  justify-content: center;
}
.calInfoTag-form {
  width: 100%;
}
.calInfoTag-save {
  padding: 1rem;
}
.el-button {
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
