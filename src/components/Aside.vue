<template>
  <div class="aside">
    <el-menu>
      <el-menu-item @click="modelInfoPage">模型资源信息</el-menu-item>
      <el-menu-item @click="calInfoPage">计算资源信息</el-menu-item>
      <el-menu-item @click="nodeChoosePage">模型部署迁移</el-menu-item>
      <el-menu-item @click="proMonitorPage">部署流程监控</el-menu-item>
      <el-menu-item @click="tolerantConfigPage">模型容错配置</el-menu-item>
      <el-menu-item @click="troubleShootPage">容错处理记录</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import router from '@/router'

const data = reactive({})

const modelInfoPage = () => {
  router.push('/')
}
const calInfoPage = () => {
  router.push('/cal')
}
const nodeChoosePage = () => {
  router.push('/node')
}

const proMonitorPage = () => {
  router.push('/monitor')
}

const tolerantConfigPage = () => {
  router.push('/config')
}

const troubleShootPage = () => {
  router.push('/shoot')
}
</script>

<style scoped>
.aside {
  height: 100%;
  width: 10rem;
  background-color: rgb(29, 48, 67);
}
.aside .el-menu {
  height: 50%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  border-right: none;
  background-color: rgb(29, 48, 67);
  /* height: 30rem; */
  /* background: var(--el-color-primary-light-8); */
}
.el-menu-item {
  height: 100%;
  color: aliceblue;
  justify-content: center;
}
</style>
