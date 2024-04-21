<template>
  <el-header>
    <div class="header-wrapper">
      <img src="../assets/Logo.png" alt="GMS" class="GMS-logo" />
      <div id="header-title">
        <div>实验室集群控制平面</div>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const data = reactive({})
</script>

<style scoped>
.header-wrapper {
  height: 4rem;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  align-content: center;
  background-color: rgba(33, 61, 91, 0.8);
}
.GMS-logo {
  margin: 0.8rem;
  margin-left: 2rem;
  margin-right: 2rem;
  /* width: 10rem; */

  /* width: 15rem; */
}
#header-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.75rem;
  color: #fff;
}
</style>
