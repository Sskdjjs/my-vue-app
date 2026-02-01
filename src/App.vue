<template>
  <div style="padding: 30px; max-width: 500px; margin: 0 auto; font-family: Arial;">
    <h1 style="text-align: center; color: #1890ff; margin-bottom: 30px;">用户管理系统</h1>
    
    <!-- 标签切换 -->
    <div style="display: flex; margin-bottom: 30px;">
      <button 
        @click="currentTab = 'login'"
        :style="{
          flex: 1,
          padding: '12px',
          background: currentTab === 'login' ? '#1890ff' : '#f5f5f5',
          color: currentTab === 'login' ? 'white' : '#666',
          border: 'none',
          cursor: 'pointer'
        }"
      >
        登录
      </button>
      <button 
        @click="currentTab = 'register'"
        :style="{
          flex: 1,
          padding: '12px',
          background: currentTab === 'register' ? '#1890ff' : '#f5f5f5',
          color: currentTab === 'register' ? 'white' : '#666',
          border: 'none',
          cursor: 'pointer'
        }"
      >
        注册
      </button>
    </div>
    
    <!-- 登录表单 -->
    <div v-if="currentTab === 'login'" style="padding: 25px; background: #fafafa; border-radius: 8px;">
      <h3 style="margin-top: 0; margin-bottom: 20px;">用户登录</h3>
      
      <input 
        v-model="loginForm.username" 
        placeholder="用户名"
        style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #d9d9d9; border-radius: 4px;"
      />
      <input 
        v-model="loginForm.password" 
        type="password"
        placeholder="密码"
        style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #d9d9d9; border-radius: 4px;"
      />
      
      <button 
        @click="handleLogin"
        :disabled="loading.login"
        style="width: 100%; padding: 12px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        {{ loading.login ? '登录中...' : '登录' }}
      </button>
    </div>
    
    <!-- 注册表单 -->
    <div v-else style="padding: 25px; background: #fafafa; border-radius: 8px;">
      <h3 style="margin-top: 0; margin-bottom: 20px;">用户注册</h3>
      
      <input 
        v-model="registerForm.username" 
        placeholder="用户名"
        style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #d9d9d9; border-radius: 4px;"
      />
      <input 
        v-model="registerForm.email" 
        type="email"
        placeholder="邮箱"
        style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #d9d9d9; border-radius: 4px;"
      />
      <input 
        v-model="registerForm.password" 
        type="password"
        placeholder="密码"
        style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #d9d9d9; border-radius: 4px;"
      />
      
      <button 
        @click="handleRegister"
        :disabled="loading.register"
        style="width: 100%; padding: 12px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        {{ loading.register ? '注册中...' : '注册' }}
      </button>
    </div>
    
    <!-- 结果显示 -->
    <div v-if="result" style="margin-top: 30px; padding: 20px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 8px;">
      <h4 style="margin-top: 0; color: #52c41a;">操作结果：</h4>
      <pre style="background: white; padding: 15px; border-radius: 4px; overflow: auto; margin: 0;">{{ result }}</pre>
    </div>
    
    <!-- 用户信息展示 -->
    <div v-if="userInfo" style="margin-top: 30px; padding: 20px; background: #e6f7ff; border: 1px solid #91d5ff; border-radius: 8px;">
      <h4 style="margin-top: 0; color: #1890ff;">用户信息：</h4>
      <pre style="background: white; padding: 15px; border-radius: 4px; overflow: auto; margin: 0;">{{ userInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 后端地址 - 根据你的Java后端修改
const API_BASE = 'http://localhost:8080/api/users'

// 当前显示的标签
const currentTab = ref('login')

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: ''
})

// 加载状态
const loading = ref({
  login: false,
  register: false
})

// 结果数据
const result = ref('')
const userInfo = ref('')

// 登录函数
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码')
    return
  }
  
  loading.value.login = true
  result.value = ''
  
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginForm.value)
    })
    
    const data = await response.json()
    result.value = JSON.stringify(data, null, 2)
    
    // 根据你的后端ApiResponse结构判断
    if (data.code === 200) {
      // 保存token
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data))
        alert(`✅ 登录成功！欢迎 ${data.data.username}`)
        
        // 清空表单
        loginForm.value = { username: '', password: '' }
        
        // 获取用户信息
        await fetchUserInfo(data.data.username)
      }
    } else {
      alert(`❌ 登录失败：${data.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('登录错误:', error)
    result.value = `请求失败：${error.message}`
    alert('❌ 网络请求失败')
  } finally {
    loading.value.login = false
  }
}

// 注册函数
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    alert('请填写所有字段')
    return
  }
  
  loading.value.register = true
  result.value = ''
  
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(registerForm.value)
    })
    
    const data = await response.json()
    result.value = JSON.stringify(data, null, 2)
    
    // 根据你的后端ApiResponse结构判断
    if (data.code === 200) {
      alert(`✅ 注册成功！用户 ${data.data?.username} 已创建`)
      
      // 清空表单
      registerForm.value = { username: '', email: '', password: '' }
      
      // 切换到登录页
      currentTab.value = 'login'
      
      // 自动填充登录表单
      loginForm.value.username = data.data?.username || ''
    } else {
      alert(`❌ 注册失败：${data.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('注册错误:', error)
    result.value = `请求失败：${error.message}`
    alert('❌ 网络请求失败')
  } finally {
    loading.value.register = false
  }
}

// 获取用户信息
const fetchUserInfo = async (username) => {
  try {
    const response = await fetch(`${API_BASE}/${username}`)
    const data = await response.json()
    
    if (data.code === 200) {
      userInfo.value = JSON.stringify(data.data, null, 2)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
</script>