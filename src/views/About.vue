<!-- src/views/About.vue -->
<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>这是一个使用Vue 3 + Vue Router的示例项目</p>
    <el-button @click="goBack">返回上一页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()  // 返回上一页
}
</script>