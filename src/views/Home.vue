<template>
  <div class="home">
    <div class="header">
      <div class="user-info">
        <span class="toilet-emoji">{{ userStore.currentSkinInfo.emoji }}</span>
        <span class="username">{{ userStore.username }}</span>
      </div>
      <div class="points">
        <span class="points-icon">💎</span>
        <span>{{ userStore.points }}</span>
      </div>
    </div>

    <div class="today-card">
      <h2>今日状态</h2>
      <div class="streak">
        <span class="streak-icon">🔥</span>
        <span class="streak-number">{{ recordStore.stats.currentStreak }}</span>
        <span class="streak-text">天连续打卡</span>
      </div>
      <div class="today-poop" v-if="hasTodayPoop">
        <span class="poop-emoji">💩</span>
        <span>今天已经拉过啦！</span>
      </div>
    </div>

    <div class="quick-actions">
      <button class="action-btn primary" @click="goToRecord">
        <span class="btn-icon">💩</span>
        <span>记录拉屎</span>
      </button>
      <button class="action-btn" @click="goToHistory">
        <span class="btn-icon">📋</span>
        <span>历史记录</span>
      </button>
      <button class="action-btn" @click="goToStats">
        <span class="btn-icon">📊</span>
        <span>数据统计</span>
      </button>
    </div>

    <div class="daily-tasks">
      <h3>今日任务</h3>
      <div class="task-list">
        <div 
          v-for="task in recordStore.dailyTasks" 
          :key="task.id" 
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <span class="task-check">{{ task.completed ? '✅' : '⬜' }}</span>
          <div class="task-info">
            <div class="task-name">{{ task.name }}</div>
            <div class="task-desc">{{ task.description }}</div>
          </div>
          <span class="task-reward">+{{ task.reward }} 💎</span>
        </div>
      </div>
    </div>

    <div class="recent-achievements" v-if="recordStore.unlockedAchievements.length > 0">
      <h3>最近成就</h3>
      <div class="achievement-list">
        <div 
          v-for="achievement in recordStore.unlockedAchievements.slice(0, 3)" 
          :key="achievement.id" 
          class="achievement-item"
        >
          <span class="achievement-emoji">{{ achievement.emoji }}</span>
          <span>{{ achievement.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '../stores/record'
import { useUserStore } from '../stores/user'

const router = useRouter()
const recordStore = useRecordStore()
const userStore = useUserStore()

const hasTodayPoop = computed(() => {
  const today = new Date().toDateString()
  return recordStore.records.some(r => new Date(r.timestamp).toDateString() === today)
})

function goToRecord() {
  router.push('/record')
}

function goToHistory() {
  router.push('/history')
}

function goToStats() {
  router.push('/stats')
}

onMounted(async () => {
  await recordStore.fetchRecords()
  await userStore.init()
})
</script>

<style scoped>
.home {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 18px;
}

.toilet-emoji {
  font-size: 32px;
}

.points {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

.today-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.today-card h2 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
}

.streak {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.streak-icon {
  font-size: 32px;
}

.streak-number {
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
}

.streak-text {
  color: #666;
}

.today-poop {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #e8f5e9;
  border-radius: 12px;
  color: #2e7d32;
}

.poop-emoji {
  font-size: 24px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  background: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-icon {
  font-size: 28px;
}

.daily-tasks {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
}

.daily-tasks h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 12px;
}

.task-item.completed {
  background: #e8f5e9;
}

.task-info {
  flex: 1;
}

.task-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 14px;
  color: #666;
}

.task-reward {
  font-weight: bold;
  color: #667eea;
}

.recent-achievements {
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.recent-achievements h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.achievement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  border-radius: 20px;
  color: #333;
  font-weight: 600;
}

.achievement-emoji {
  font-size: 20px;
}
</style>
