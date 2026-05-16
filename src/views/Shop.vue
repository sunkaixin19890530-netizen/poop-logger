<template>
  <div class="shop-page">
    <h1 class="page-title">🛒 商店</h1>
    <div class="user-info">
      <span class="user-points">💰 {{ points }} 积分</span>
    </div>

    <div class="section">
      <h2>🚽 马桶皮肤</h2>
      <div class="skins-grid">
        <div 
          v-for="skin in skins" 
          :key="skin.id" 
          class="skin-item"
          :class="{ selected: skin.id === currentSkin, unlocked: skin.unlocked }"
        >
          <div class="skin-emoji">{{ skin.emoji }}</div>
          <div class="skin-name">{{ skin.name }}</div>
          <div class="skin-price" v-if="!skin.unlocked">
            {{ skin.cost }} 积分
          </div>
          <div class="skin-status" v-else-if="skin.id === currentSkin">
            使用中
          </div>
          <div class="skin-status" v-else>
            已解锁
          </div>
          <button 
            v-if="!skin.unlocked"
            class="btn btn-buy"
            :disabled="points < skin.cost"
            @click="buySkin(skin)"
          >
            购买
          </button>
          <button 
            v-else-if="skin.id !== currentSkin"
            class="btn btn-use"
            @click="useSkin(skin)"
          >
            使用
          </button>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🎁 更多功能</h2>
      <div class="feature-list">
        <div class="feature-item coming-soon">
          <span class="feature-emoji">🎨</span>
          <div class="feature-info">
            <div class="feature-name">屎相滤镜</div>
            <div class="feature-desc">即将上线</div>
          </div>
        </div>
        <div class="feature-item coming-soon">
          <span class="feature-emoji">🎵</span>
          <div class="feature-info">
            <div class="feature-name">背景音乐包</div>
            <div class="feature-desc">即将上线</div>
          </div>
        </div>
        <div class="feature-item coming-soon">
          <span class="feature-emoji">📊</span>
          <div class="feature-info">
            <div class="feature-name">高级统计</div>
            <div class="feature-desc">即将上线</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const points = ref(0)
const currentSkin = ref('default')
const skins = ref([])

onMounted(async () => {
  await userStore.init()
  points.value = userStore.points
  currentSkin.value = userStore.currentSkin
  skins.value = userStore.availableSkins
})

const buySkin = async (skin) => {
  if (!confirm(`确定花费 ${skin.cost} 积分购买 ${skin.name} 吗？`)) return
  
  const success = await userStore.unlockSkin(skin.id)
  if (success) {
    points.value = userStore.points
    skins.value = userStore.availableSkins
    alert(`购买成功！已解锁 ${skin.name}`)
  } else {
    alert('购买失败，积分不足或已拥有该皮肤')
  }
}

const useSkin = async (skin) => {
  const success = await userStore.setCurrentSkin(skin.id)
  if (success) {
    currentSkin.value = userStore.currentSkin
    alert(`已切换到 ${skin.name}`)
  }
}
</script>

<style scoped>
.user-info {
  text-align: right;
  margin-bottom: 20px;
}

.user-points {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  background: #fff8dc;
  padding: 10px 20px;
  border-radius: 20px;
}

.section {
  margin-bottom: 30px;
}

.section h2 {
  margin-bottom: 15px;
  color: #333;
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.skin-item {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  border: 3px solid transparent;
  transition: all 0.3s;
}

.skin-item.unlocked {
  background: #e8f5e9;
}

.skin-item.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
}

.skin-emoji {
  font-size: 48px;
  margin-bottom: 10px;
}

.skin-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.skin-price {
  color: #ff9800;
  font-weight: bold;
  margin-bottom: 10px;
}

.skin-status {
  color: #4caf50;
  font-weight: 600;
  margin-bottom: 10px;
}

.skin-item.selected .skin-status {
  color: #667eea;
}

.btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-buy {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-buy:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-use {
  background: #4caf50;
  color: white;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.feature-item.coming-soon {
  opacity: 0.6;
}

.feature-emoji {
  font-size: 32px;
}

.feature-name {
  font-weight: 600;
  color: #333;
}

.feature-desc {
  font-size: 14px;
  color: #666;
}
</style>
