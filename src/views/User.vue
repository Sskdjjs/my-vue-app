<!-- src/views/User.vue -->
<template>
  <div class="user">
    <h1>用户信息</h1>
    
    <!-- 显示路由参数 -->
    <p>用户ID：{{ userId }}</p>
    
    <!-- 使用Element Plus组件 -->
    <el-card class="user-card">
      <template #header>
        <span>用户详情</span>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userInfo.username }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ userInfo.email }}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ userInfo.createdAt }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    
    <!-- 其他用户链接 -->
    <div class="user-links">
      <router-link :to="`/user/${userId - 1}`">上一个用户</router-link>
      <router-link :to="`/user/${userId + 1}`">下一个用户</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// 获取路由参数
const route = useRoute()
const userId = ref(route.params.id)

// 模拟用户数据
const userInfo = ref({
  username: `用户${userId.value}`,
  email: `user${userId.value}@example.com`,
  createdAt: '2023-10-01'
})

// 监听路由参数变化
import { watch } from 'vue'
watch(
  () => route.params.id,
  (newId) => {
    userId.value = newId
    // 这里可以重新请求用户数据
    userInfo.value.username = `用户${newId}`
    userInfo.value.email = `user${newId}@example.com`
  }
)
</script>

<style scoped>
.user {
  padding: 20px;
}

.user-card {
  margin: 20px 0;
}

.user-links {
  margin-top: 20px;
}

.user-links a {
  margin-right: 15px;
}
</style>