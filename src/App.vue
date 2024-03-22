<template>
  <el-container class="main-container">
    <el-header><Header></Header></el-header>
    <el-container>
      <el-aside><Aside></Aside></el-aside>
      <el-main> <RouterView /></el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Header from './components/Header.vue'
import Aside from './components/Aside.vue'
import Footer from './components/Footer.vue'
</script>

<style>
/* Clean the partial formatting of el-header*/
.el-header {
  --el-header-padding: none;
  --el-header-height: none;
}

.el-aside {
  width: fit-content;
  height: 100%;
}
/* Set first container to full srceen */
.main-container {
  height: 100%;
}
</style>
