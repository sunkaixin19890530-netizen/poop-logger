<template>
  <div class="stats">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>数据统计</h1>
      <div class="placeholder"></div>
    </div>

    <div class="stats-container" v-if="!recordStore.loading">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ recordStore.stats.totalRecords }}</div>
          <div class="stat-label">总记录数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ recordStore.stats.totalScore }}</div>
          <div class="stat-label">总得分</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ recordStore.stats.maxStreak }}</div>
          <div class="stat-label">最长连续</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ recordStore.stats.currentStreak }}</div>
          <div class="stat-label">当前连续</div>
        </div>
      </div>

      <div class="section">
        <h3>屎相收集 📚</h3>
        <div class="type-collection">
          <div 
            v-for="type in POOP_TYPES" 
            :key="type.id" 
            class="type-item"
            :class="{ collected: recordStore.stats.collectedTypes.includes(type.id) }"
          >
            <span class="type-emoji">{{ type.emoji }}</span>
            <span class="type-name">{{ type.name }}</span>
            <span v-if="recordStore.stats.collectedTypes.includes(type.id)" class="check-mark">✓</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>其他数据</h3>
        <div class="data-list">
          <div class="data-item">
            <span class="data-label">早起鸟次数</span>
            <span class="data-value">{{ recordStore.stats.earlyBirdCount }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">夜猫子次数</span>
            <span class="data-value">{{ recordStore.stats.nightOwlCount }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">最长完美连续</span>
            <span class="data-value">{{ recordStore.stats.maxPerfectStreak }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">马拉松次数</span>
            <span class="data-value">{{ recordStore.stats.marathonCount }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">闪电侠次数</span>
            <span class="data-value">{{ recordStore.stats.flashCount }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">平均时长</span>
            <span class="data-value">{{ recordStore.stats.avgDuration.toFixed(1) }} 分钟</span>
          </div>
          <div class="data-item">
            <span class="data-label">平均得分</span>
            <span class="data-value">{{ recordStore.stats.avgScore.toFixed(1) }}</span>
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
import { POOP_TYPES } from '../utils/constants'

const router = useRouter()
const recordStore = useRecordStore()

function goBack() {
  router.back()
}

onMounted(async () => {
  await recordStore.fetchRecords()
})
</script>

<style scoped>
.stats {
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

.stats-container {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.type-collection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 12px;
  opacity: 0.5;
}

.type-item.collected {
  opacity: 1;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
}

.type-emoji {
  font-size: 24px;
}

.type-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.check-mark {
  color: #4caf50;
  font-weight: bold;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.data-label {
  color: #666;
}

.data-value {
  font-weight: 600;
  color: #333;
}
</style>
