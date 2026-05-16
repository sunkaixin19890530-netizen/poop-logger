<template>
  <div class="share-page">
    <h1 class="page-title">📸 分享</h1>

    <div class="section">
      <h2>选择分享内容</h2>
      <div class="share-options">
        <button class="share-option-btn" @click="showStatsCard = true; showAchievementCard = false">
          📊 数据统计
        </button>
        <button class="share-option-btn" @click="showAchievementCard = true; showStatsCard = false" v-if="unlockedAchievements.length > 0">
          🏆 成就
        </button>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div v-if="showStatsCard" class="card-preview-container">
      <div class="preview-label">预览</div>
      <div ref="statsCardRef" class="share-card stats-card">
        <div class="card-header">
          <span class="card-title">💩 屎王争霸</span>
          <span class="card-date">{{ currentDate }}</span>
        </div>
        <div class="card-user">
          <span class="user-name">{{ username }}</span>
        </div>
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalRecords }}</div>
            <div class="stat-label">总记录</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalScore }}</div>
            <div class="stat-label">总积分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.currentStreak }}</div>
            <div class="stat-label">连续打卡</div>
          </div>
        </div>
        <div class="card-footer">
          <span class="card-app-name">Poop Logger 2.0</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" @click="shareStatsCard">📸 分享图片</button>
        <button class="btn btn-secondary" @click="copyStatsLink">🔗 复制链接</button>
      </div>
    </div>

    <!-- 成就卡片 -->
    <div v-if="showAchievementCard" class="card-preview-container">
      <div class="preview-label">选择成就</div>
      <div class="achievements-selector">
        <div 
          v-for="achievement in unlockedAchievements" 
          :key="achievement.id"
          class="achievement-option"
          :class="{ selected: selectedAchievement?.id === achievement.id }"
          @click="selectedAchievement = achievement"
        >
          <span class="achievement-emoji">{{ achievement.emoji }}</span>
          <span class="achievement-name">{{ achievement.name }}</span>
        </div>
      </div>
      <div v-if="selectedAchievement" class="achievement-card-container">
        <div class="preview-label">预览</div>
        <div ref="achievementCardRef" class="share-card achievement-card">
          <div class="card-header">
            <span class="card-title">🏆 成就解锁</span>
            <span class="card-date">{{ currentDate }}</span>
          </div>
          <div class="achievement-display">
            <div class="achievement-big-emoji">{{ selectedAchievement.emoji }}</div>
            <div class="achievement-name">{{ selectedAchievement.name }}</div>
            <div class="achievement-desc">{{ selectedAchievement.description }}</div>
          </div>
          <div class="card-user">
            <span class="user-name">{{ username }}</span>
          </div>
          <div class="card-footer">
            <span class="card-app-name">Poop Logger 2.0</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" @click="shareAchievementCard">📸 分享图片</button>
          <button class="btn btn-secondary" @click="copyAchievementLink">🔗 复制链接</button>
        </div>
      </div>
    </div>

    <!-- 如果没有数据，显示提示 -->
    <div v-if="!showStatsCard && !showAchievementCard && stats.totalRecords === 0" class="card">
      <h2>还没有数据哦！</h2>
      <p>快去记录你的第一次拉屎吧！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRecordStore } from '../stores/record'
import { shareImage, downloadImage, elementToImage, generateShareLink } from '../utils/share'

const userStore = useUserStore()
const recordStore = useRecordStore()

const statsCardRef = ref(null)
const achievementCardRef = ref(null)
const showStatsCard = ref(false)
const showAchievementCard = ref(false)
const selectedAchievement = ref(null)
const username = ref('屎民')
const currentDate = ref('')

onMounted(async () => {
  await userStore.init()
  await recordStore.fetchRecords()
  username.value = userStore.username
  currentDate.value = new Date().toLocaleDateString('zh-CN')
})

const stats = computed(() => recordStore.stats)
const unlockedAchievements = computed(() => recordStore.unlockedAchievements)

const shareStatsCard = async () => {
  if (!statsCardRef.value) return
  const result = await shareImage(statsCardRef.value, 'poop-logger-stats.png')
  if (result.success) {
    alert(result.method === 'clipboard' ? '图片已复制到剪贴板！' : '图片已下载！')
  } else {
    alert('分享失败，请重试')
  }
}

const shareAchievementCard = async () => {
  if (!achievementCardRef.value) return
  const result = await shareImage(achievementCardRef.value, 'poop-logger-achievement.png')
  if (result.success) {
    alert(result.method === 'clipboard' ? '图片已复制到剪贴板！' : '图片已下载！')
  } else {
    alert('分享失败，请重试')
  }
}

const copyStatsLink = async () => {
  const link = generateShareLink('stats', {
    username: username.value,
    stats: stats.value,
    date: currentDate.value
  })
  await navigator.clipboard.writeText(link)
  alert('链接已复制到剪贴板！')
}

const copyAchievementLink = async () => {
  if (!selectedAchievement.value) return
  const link = generateShareLink('achievement', {
    username: username.value,
    achievement: selectedAchievement.value,
    date: currentDate.value
  })
  await navigator.clipboard.writeText(link)
  alert('链接已复制到剪贴板！')
}
</script>

<style scoped>
.section {
  margin-bottom: 30px;
}

.section h2 {
  margin-bottom: 15px;
  color: #333;
}

.share-options {
  display: flex;
  gap: 15px;
}

.share-option-btn {
  flex: 1;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.share-option-btn:hover {
  transform: scale(1.02);
}

.card-preview-container {
  margin-top: 20px;
}

.preview-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.share-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25px;
  border-radius: 20px;
  color: white;
  max-width: 400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
}

.card-date {
  font-size: 14px;
  opacity: 0.9;
}

.card-user {
  text-align: center;
  margin-bottom: 20px;
}

.user-name {
  font-size: 24px;
  font-weight: bold;
}

.card-stats {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.card-footer {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.card-app-name {
  font-size: 14px;
  opacity: 0.8;
}

.achievements-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.achievement-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f0f0f0;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.achievement-option.selected {
  border-color: #667eea;
  background: #667eea20;
}

.achievement-emoji {
  font-size: 24px;
}

.achievement-name {
  font-weight: 600;
}

.achievement-display {
  text-align: center;
  margin-bottom: 20px;
}

.achievement-big-emoji {
  font-size: 64px;
  margin-bottom: 10px;
}

.achievement-card .achievement-name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.achievement-card .achievement-desc {
  font-size: 16px;
  opacity: 0.9;
}

.card-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}
</style>
