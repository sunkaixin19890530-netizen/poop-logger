<template>
  <div class="friends-page">
    <h1 class="page-title">👥 好友</h1>

    <!-- 添加好友区域 -->
    <div class="section">
      <h2>添加好友</h2>
      <div class="add-friend-form">
        <input 
          type="text" 
          v-model="friendCodeInput" 
          placeholder="输入好友码"
          maxlength="6"
        />
        <button class="btn btn-primary" @click="addFriend" :disabled="!friendCodeInput || friendCodeInput.length < 6">
          添加
        </button>
      </div>
    </div>

    <!-- 我的好友码 -->
    <div class="section">
      <h2>我的好友码</h2>
      <div class="my-friend-code">
        <div class="friend-code-display">{{ myFriendCode }}</div>
        <button class="btn btn-secondary" @click="copyMyCode">复制</button>
      </div>
    </div>

    <!-- 好友列表 -->
    <div class="section">
      <h2>我的好友 ({{ friends.length }})</h2>
      <div v-if="friends.length === 0" class="empty-state">
        <p>还没有好友，快去添加吧！</p>
      </div>
      <div v-else class="friends-list">
        <div v-for="friend in friends" :key="friend.id" class="friend-item">
          <div class="friend-avatar">👤</div>
          <div class="friend-info">
            <div class="friend-name">{{ friend.name }}</div>
            <div class="friend-code-small">{{ friend.friendCode }}</div>
          </div>
          <div class="friend-stats">
            <div class="friend-stat">
              <span class="stat-value">{{ friend.totalScore || 0 }}</span>
              <span class="stat-label">积分</span>
            </div>
            <div class="friend-stat">
              <span class="stat-value">{{ friend.totalRecords || 0 }}</span>
              <span class="stat-label">记录</span>
            </div>
          </div>
          <button class="btn btn-delete" @click="removeFriend(friend.id)">×</button>
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="section" v-if="friends.length > 0">
      <h2>🏆 排行榜</h2>
      <div class="leaderboard">
        <div 
          v-for="(item, index) in leaderboard" 
          :key="item.id" 
          class="leaderboard-item"
          :class="{ 'top-3': index < 3 }"
        >
          <div class="rank" :class="'rank-' + (index + 1)">
            {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 }}
          </div>
          <div class="leaderboard-avatar">👤</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">{{ item.name }}</div>
          </div>
          <div class="leaderboard-score">{{ item.totalScore || 0 }} 分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRecordStore } from '../stores/record'
import { generateId } from '../utils/helpers'

const userStore = useUserStore()
const recordStore = useRecordStore()

const friendCodeInput = ref('')
const myFriendCode = ref('')
const friends = ref([])

onMounted(async () => {
  await userStore.init()
  await recordStore.fetchRecords()
  myFriendCode.value = userStore.friendCode
  friends.value = userStore.friends
})

const addFriend = async () => {
  if (friendCodeInput.value.toUpperCase() === myFriendCode.value) {
    alert('不能添加自己为好友！')
    return
  }

  if (friends.value.some(f => f.friendCode === friendCodeInput.value.toUpperCase())) {
    alert('已经添加过这个好友了！')
    return
  }

  const newFriend = {
    id: generateId(),
    name: `屎友 ${friendCodeInput.value.toUpperCase()}`,
    friendCode: friendCodeInput.value.toUpperCase(),
    totalScore: Math.floor(Math.random() * 500),
    totalRecords: Math.floor(Math.random() * 50),
    addedAt: Date.now()
  }

  await userStore.addNewFriend(newFriend)
  friends.value = userStore.friends
  friendCodeInput.value = ''
  alert('添加好友成功！')
}

const removeFriend = async (id) => {
  if (!confirm('确定要删除这个好友吗？')) return
  await userStore.removeFriend(id)
  friends.value = userStore.friends
}

const copyMyCode = async () => {
  await navigator.clipboard.writeText(myFriendCode.value)
  alert('好友码已复制到剪贴板！')
}

const leaderboard = computed(() => {
  // 把自己也加入排行榜
  const me = {
    id: 'me',
    name: userStore.username || '我',
    friendCode: myFriendCode.value,
    totalScore: recordStore.stats.totalScore,
    totalRecords: recordStore.stats.totalRecords,
    isMe: true
  }

  return [...friends.value, me]
    .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
})
</script>

<style scoped>
.section {
  margin-bottom: 30px;
}

.section h2 {
  margin-bottom: 15px;
  color: #333;
}

.add-friend-form {
  display: flex;
  gap: 10px;
}

.add-friend-form input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  text-transform: uppercase;
  font-family: monospace;
  letter-spacing: 4px;
  text-align: center;
}

.add-friend-form input:focus {
  outline: none;
  border-color: #667eea;
}

.my-friend-code {
  display: flex;
  align-items: center;
  gap: 15px;
}

.friend-code-display {
  flex: 1;
  font-family: monospace;
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  background: #f0f0f0;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  letter-spacing: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.friend-avatar {
  font-size: 36px;
}

.friend-info {
  flex: 1;
}

.friend-name {
  font-weight: 600;
  color: #333;
}

.friend-code-small {
  font-size: 12px;
  color: #666;
  font-family: monospace;
}

.friend-stats {
  display: flex;
  gap: 20px;
}

.friend-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: bold;
  font-size: 18px;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.btn-delete {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #ff6b6b;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.2s;
}

.leaderboard-item.top-3 {
  background: linear-gradient(135deg, #fff8dc 0%, #fffaf0 100%);
}

.rank {
  width: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}

.rank-1 { color: #ffd700; }
.rank-2 { color: #c0c0c0; }
.rank-3 { color: #cd7f32; }

.leaderboard-avatar {
  font-size: 32px;
}

.leaderboard-info {
  flex: 1;
}

.leaderboard-name {
  font-weight: 600;
  color: #333;
}

.leaderboard-score {
  font-weight: bold;
  font-size: 18px;
  color: #667eea;
}
</style>
