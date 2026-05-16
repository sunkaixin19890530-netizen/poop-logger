<template>
  <div class="history">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>历史记录</h1>
      <div class="placeholder"></div>
    </div>

    <div class="records-container" v-if="!recordStore.loading">
      <div v-if="recordStore.records.length === 0" class="empty-state">
        <span class="empty-emoji">💩</span>
        <p>还没有记录，快去记录吧！</p>
      </div>

      <div v-else class="records-list">
        <div 
          v-for="record in recordStore.records" 
          :key="record.id" 
          class="record-item"
        >
          <div class="record-header">
            <div class="record-type">
              <span class="type-emoji">{{ record.typeEmoji }}</span>
              <span class="type-name">{{ record.typeName }}</span>
            </div>
            <span class="record-score">{{ record.score > 0 ? '+' : '' }}{{ record.score }}</span>
          </div>
          <div class="record-time">{{ formatTime(record.timestamp) }}</div>
          <div v-if="record.duration" class="record-duration">
            ⏱️ {{ record.duration }} 分钟
          </div>
          <div v-if="record.notes" class="record-notes">{{ record.notes }}</div>
          <button class="delete-btn" @click="deleteRecord(record.id)">删除</button>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      加载中...
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '../stores/record'
import { formatDate, getTimeDescription } from '../utils/helpers'

const router = useRouter()
const recordStore = useRecordStore()

function goBack() {
  router.back()
}

function formatTime(timestamp) {
  return `${getTimeDescription(timestamp)} · ${formatDate(timestamp)}`
}

async function deleteRecord(id) {
  if (confirm('确定要删除这条记录吗？')) {
    await recordStore.removeRecord(id)
  }
}

onMounted(async () => {
  await recordStore.fetchRecords()
})
</script>

<style scoped>
.history {
  min-height: 100vh;
  background: #f5f5f5;
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

.records-container {
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-emoji {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-item {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-emoji {
  font-size: 28px;
}

.type-name {
  font-weight: 600;
  color: #333;
}

.record-score {
  font-weight: bold;
  font-size: 18px;
  color: #667eea;
}

.record-time {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.record-duration {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.record-notes {
  font-size: 14px;
  color: #666;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.delete-btn {
  padding: 8px 16px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}
</style>
