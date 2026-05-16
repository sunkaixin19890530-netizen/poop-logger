<template>
  <div class="settings-page">
    <h1 class="page-title">⚙️ 设置</h1>
    <div class="card">
      <h2>个人信息</h2>
      <div class="setting-item">
        <label>昵称</label>
        <input type="text" v-model="nickname" placeholder="输入你的昵称" @change="saveNickname" />
      </div>
      <div class="setting-item">
        <label>好友码</label>
        <div class="friend-code">{{ friendCode }}</div>
      </div>
      <div class="setting-item">
        <label>当前积分</label>
        <div class="points">{{ points }} 分</div>
      </div>
    </div>
    <div class="card">
      <h2>数据管理</h2>
      <div class="setting-item">
        <button class="btn btn-secondary" @click="exportData">📤 导出数据</button>
      </div>
      <div class="setting-item">
        <button class="btn btn-secondary" @click="triggerImport">📥 导入数据</button>
        <input type="file" ref="fileInput" accept=".json" style="display: none" @change="importData" />
      </div>
      <div class="setting-item">
        <button class="btn btn-secondary" style="background: #ff6b6b; color: white;" @click="clearData">🗑️ 清除所有数据</button>
      </div>
    </div>
    <div class="card">
      <h2>关于</h2>
      <p>💩 Poop Logger 2.0</p>
      <p class="version-text" @click="versionClick">
        版本：2.0.0
        <span v-if="clickCount > 0" class="click-counter">({{ 7 - clickCount }}次)</span>
      </p>
      <p>纯前端版本，数据安全存储在本地</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { exportAllData, importData as importDBData, openDB } from '../utils/db'

const router = useRouter()
const userStore = useUserStore()
const nickname = ref('')
const friendCode = ref('')
const points = ref(0)
const fileInput = ref(null)
const clickCount = ref(0)
let lastClickTime = 0

onMounted(async () => {
  await userStore.init()
  nickname.value = userStore.username
  friendCode.value = userStore.friendCode
  points.value = userStore.points
})

const versionClick = () => {
  const now = Date.now()
  
  // 如果距离上次点击超过2秒，重置计数
  if (now - lastClickTime > 2000) {
    clickCount.value = 0
  }
  
  clickCount.value++
  lastClickTime = now
  
  // 连续点击7次后跳转
  if (clickCount.value >= 7) {
    clickCount.value = 0
    router.push('/test')
  }
}

const saveNickname = () => {
  userStore.setUsername(nickname.value)
}

const exportData = async () => {
  try {
    const data = await exportAllData()
    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `poop-logger-backup-${new Date().toISOString().split('T')[0]}.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    alert('数据导出成功！')
  } catch (e) {
    console.error('导出失败:', e)
    alert('数据导出失败：' + e.message)
  }
}

const triggerImport = () => {
  fileInput.value.click()
}

const importData = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!confirm('导入数据将覆盖现有数据，确定继续吗？')) {
    event.target.value = ''
    return
  }

  try {
    const text = await file.text()
    const data = JSON.parse(text)
    await importDBData(data)
    alert('数据导入成功！请刷新页面。')
    location.reload()
  } catch (e) {
    console.error('导入失败:', e)
    alert('数据导入失败：' + e.message)
  }
  event.target.value = ''
}

const clearData = async () => {
  if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) return
  if (!confirm('真的要清除吗？所有记录、好友、设置都将被删除！')) return

  try {
    // 删除 IndexedDB
    const dbName = 'poop-logger-db'
    const request = indexedDB.deleteDatabase(dbName)
    
    request.onsuccess = () => {
      alert('数据已清除！页面将刷新。')
      location.reload()
    }
    
    request.onerror = () => {
      alert('清除数据失败')
    }
  } catch (e) {
    console.error('清除失败:', e)
    alert('清除数据失败：' + e.message)
  }
}
</script>

<style scoped>
.setting-item {
  margin: 15px 0;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.setting-item input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
}

.setting-item input:focus {
  outline: none;
  border-color: #667eea;
}

.friend-code {
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  background: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  letter-spacing: 4px;
}

.points {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
}

.version-text {
  cursor: pointer;
  user-select: none;
  transition: color 0.3s;
}

.version-text:hover {
  color: #667eea;
}

.click-counter {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}

.card h2 {
  margin-bottom: 15px;
  color: #333;
}
</style>
