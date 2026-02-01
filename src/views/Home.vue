<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <h1>欢迎来到首页！</h1>
    <el-button type="primary" @click="goToAbout">
      前往关于页面
    </el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToAbout = () => {
  // 编程式导航
  router.push('/about')
}
</script>

<style scoped>
.home {
  padding: 40px;
  text-align: center;
}
</style>