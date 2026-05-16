<template>
  <div class="achievements">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>成就系统</h1>
      <div class="placeholder"></div>
    </div>

    <div class="achievements-container">
      <div class="summary">
        <div class="summary-count">
          {{ recordStore.unlockedAchievements.length }} / {{ ACHIEVEMENTS.length }}
        </div>
        <div class="summary-label">已解锁成就</div>
      </div>

      <div class="achievement-list">
        <div 
          v-for="achievement in ACHIEVEMENTS" 
          :key="achievement.id" 
          class="achievement-card"
          :class="{ unlocked: isUnlocked(achievement.id) }"
        >
          <div class="achievement-emoji">{{ achievement.emoji }}</div>
          <div class="achievement-info">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
          </div>
          <div class="achievement-status">
            {{ isUnlocked(achievement.id) ? '✓ 已解锁' : '🔒 未解锁' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '../stores/record'
import { ACHIEVEMENTS } from '../utils/constants'

const router = useRouter()
const recordStore = useRecordStore()

function goBack() {
  router.back()
}

function isUnlocked(achievementId) {
  return recordStore.unlockedAchievements.some(a => a.id === achievementId)
}

onMounted(async () => {
  await recordStore.fetchRecords()
})
</script>

<style scoped>
.achievements {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
}

.header h1 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.placeholder {
  width: 60px;
}

.achievements-container {
  padding: 20px;
}

.summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.summary-count {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
}

.summary-label {
  font-size: 16px;
  opacity: 0.9;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  opacity: 0.6;
}

.achievement-card.unlocked {
  opacity: 1;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.achievement-emoji {
  font-size: 40px;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.achievement-desc {
  font-size: 14px;
  color: #666;
}

.achievement-status {
  font-size: 14px;
  font-weight: 600;
}

.achievement-card.unlocked .achievement-status {
  color: #4caf50;
}
</style>
