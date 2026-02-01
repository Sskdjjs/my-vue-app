// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

// 定义路由
const routes = [
  {
    path: '/',           // 访问路径
    name: 'Home',        // 路由名称
    component: Home      // 对应的组件
  },
  {
    path: '/about',
    name: 'About',
    // 懒加载（推荐）
    component: () => import('../views/About.vue')
  },
  {
    path: '/user/:id',   // 动态路由，:id是参数
    name: 'User',
    component: () => import('../views/User.vue')
  }
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: () => import('../views/Dashboard.vue'),
//     // 路由元信息（可用于权限控制）
//     meta: { requiresAuth: true }
//   }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),  // 使用HTML5 history模式
  routes
})

export default router