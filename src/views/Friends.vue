<template>
  <div class="friends-page">
    <h1 class="page-title">💩⚔️ 屎命召唤</h1>

    <!-- 处理 PK 链接 -->
    <div v-if="pendingPK" class="pk-invitation card">
      <h3>⚔️ 收到挑战！</h3>
      <p><strong>挑衅语录：</strong>{{ pendingPK.payload.taunt }}</p>
      <div class="challenger-stats">
        <div>总积分：{{ pendingPK.payload.stats.totalScore || 0 }}</div>
        <div>总记录：{{ pendingPK.payload.stats.totalRecords || 0 }}</div>
        <div>最长连续：{{ pendingPK.payload.stats.maxStreak || 0 }}天</div>
      </div>
      <div class="pk-actions">
        <button class="btn btn-primary" @click="acceptPK">接受挑战！</button>
        <button class="btn btn-secondary" @click="declinePK">忽略</button>
      </div>
    </div>

    <!-- PK 结果展示 -->
    <div v-if="pkResult" class="pk-result card">
      <h2>{{ pkResult.isDraw ? '🤝 平局！' : pkResult.winner === 'me' ? '🎉 胜利！' : '😢 失败...' }}</h2>
      <div class="pk-dimensions">
        <div v-for="dim in pkResult.dimensions" :key="dim.name" class="dimension">
          <span>{{ dim.name }}</span>
          <span :class="{ winner: dim.winner === 'challenger' }">我：{{ dim.challengerValue }}</span>
          <span>VS</span>
          <span :class="{ winner: dim.winner === 'defender' }">对手：{{ dim.defenderValue }}</span>
        </div>
      </div>
      <div v-if="pkResult.randomEvent" class="random-event">
        🎲 {{ pkResult.randomEvent.name }}：{{ pkResult.randomEvent.description }}
      </div>
      <div v-if="pkResult.medal" class="medal-earned">
        🎖️ 获得勋章：{{ pkResult.medal.emoji }} {{ pkResult.medal.name }}
      </div>
      <button class="btn btn-primary" @click="clearPKResult">确定</button>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab" 
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.emoji }} {{ tab.name }}
      </button>
    </div>

    <!-- PK 大厅 -->
    <div v-if="activeTab === 'lobby'" class="tab-content">
      <div class="card">
        <h3>⚔️ 发起挑战</h3>
        <div class="form-group">
          <label>挑衅语录</label>
          <input v-model="taunt" type="text" placeholder="来一场屎命召唤吧！" />
        </div>
        <button class="btn btn-primary btn-full" @click="createBattleLink">生成战斗链接</button>
        
        <div v-if="battleLink" class="battle-link-section">
          <p class="link-display">{{ battleLink }}</p>
          <div class="battle-actions">
            <button class="btn btn-secondary" @click="copyBattleLink">复制链接</button>
            <button class="btn btn-secondary" @click="shareAsQR">二维码分享</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>📊 我的战绩</h3>
        <div class="my-stats">
          <div>总积分：{{ myStats.totalScore || 0 }}</div>
          <div>总记录：{{ myStats.totalRecords || 0 }}</div>
          <div>最长连续：{{ myStats.maxStreak || 0 }}天</div>
        </div>
      </div>
    </div>

    <!-- 好友列表 -->
    <div v-if="activeTab === 'friends'" class="tab-content">
      <div v-if="friends.length === 0" class="empty-state">
        <p>还没有好友，通过战斗链接添加吧！</p>
      </div>
      <div v-else class="friends-list">
        <div v-for="friend in friends" :key="friend.id" class="friend-item card">
          <div class="friend-avatar">👤</div>
          <div class="friend-info">
            <div class="friend-name">{{ friend.name }}</div>
            <div class="friend-stats">
              <span>积分：{{ friend.totalScore || 0 }}</span>
              <span>记录：{{ friend.totalRecords || 0 }}</span>
            </div>
          </div>
          <button class="btn btn-primary" @click="challengeFriend(friend)">PK</button>
        </div>
      </div>
    </div>

    <!-- PK 历史 -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div v-if="pkHistory.length === 0" class="empty-state">
        <p>还没有 PK 记录</p>
      </div>
      <div v-else class="pk-history-list">
        <div v-for="record in pkHistory" :key="record.id" class="pk-record card">
          <div class="pk-result-emoji">
            {{ record.result.isDraw ? '🤝' : record.result.winner === 'me' ? '🎉' : '😢' }}
          </div>
          <div class="pk-info">
            <div>VS {{ record.opponentName }}</div>
            <div class="pk-time">{{ formatPKTime(record.timestamp) }}</div>
          </div>
          <div class="pk-outcome">
            {{ record.result.isDraw ? '平局' : record.result.winner === 'me' ? '胜利' : '失败' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 勋章墙 -->
    <div v-if="activeTab === 'medals'" class="tab-content">
      <div v-if="pkMedals.length === 0" class="empty-state">
        <p>还没有勋章，快去 PK 吧！</p>
      </div>
      <div v-else class="medals-grid">
        <div v-for="medal in pkMedals" :key="medal.id" class="medal-item card">
          <div class="medal-emoji">{{ medal.emoji }}</div>
          <div class="medal-name">{{ medal.name }}</div>
          <div class="medal-desc">{{ medal.description }}</div>
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div v-if="activeTab === 'leaderboard'" class="tab-content">
      <div class="leaderboard-list">
        <div 
          v-for="(item, index) in leaderboard" 
          :key="item.id" 
          class="leaderboard-item card"
          :class="{ top3: index < 3, me: item.isMe }"
        >
          <div class="rank">{{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 }}</div>
          <div class="leaderboard-avatar">👤</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">{{ item.name }}{{ item.isMe ? ' (我)' : '' }}</div>
          </div>
          <div class="leaderboard-score">{{ item.totalScore || 0 }} 分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useRecordStore } from '../stores/record'
import { decodeShareData, generatePKChallenge, generateBattleLink, runPKEngine } from '../utils/share'
import { formatDate } from '../utils/helpers'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const recordStore = useRecordStore()

// 标签页
const tabs = [
  { id: 'lobby', name: 'PK 大厅', emoji: '⚔️' },
  { id: 'friends', name: '好友', emoji: '👥' },
  { id: 'history', name: '历史', emoji: '📜' },
  { id: 'medals', name: '勋章', emoji: '🎖️' },
  { id: 'leaderboard', name: '排行榜', emoji: '🏆' }
]

const activeTab = ref('lobby')
const taunt = ref('来一场屎命召唤吧！')
const battleLink = ref('')
const pendingPK = ref(null)
const pkResult = ref(null)
const currentOpponent = ref(null)

const friends = computed(() => userStore.friends)
const pkHistory = computed(() => userStore.pkHistory)
const pkMedals = computed(() => userStore.pkMedals)
const myStats = computed(() => recordStore.stats)

// 排行榜
const leaderboard = computed(() => {
  const me = {
    id: 'me',
    name: userStore.username || '我',
    totalScore: myStats.value.totalScore,
    totalRecords: myStats.value.totalRecords,
    isMe: true
  }

  return [...friends.value, me]
    .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
})

onMounted(async () => {
  await userStore.init()
  await recordStore.fetchRecords()
  
  // 检查 URL 中是否有 PK 参数
  checkForPKInURL()
})

// 监听路由变化
watch(() => route.hash, () => {
  checkForPKInURL()
})

function checkForPKInURL() {
  const hash = route.hash
  const pkMatch = hash.match(/pk=([^&]+)/)
  if (pkMatch) {
    const encoded = pkMatch[1]
    const data = decodeShareData(encoded)
    if (data && data.type === 'pk_challenge') {
      pendingPK.value = data
      // 清除 URL 中的 pk 参数
      router.replace({ hash: '/friends' })
    }
  }
}

function createBattleLink() {
  const pkData = generatePKChallenge(myStats.value, taunt.value)
  battleLink.value = generateBattleLink(pkData)
}

function copyBattleLink() {
  navigator.clipboard.writeText(battleLink.value)
  alert('战斗链接已复制！')
}

function shareAsQR() {
  alert('二维码分享功能开发中...')
}

async function acceptPK() {
  const challengerStats = pendingPK.value.payload.stats
  const myPKStats = {
    totalScore: myStats.value.totalScore,
    totalRecords: myStats.value.totalRecords,
    longestStreak: myStats.value.maxStreak
  }
  
  const challengerPKStats = {
    totalScore: challengerStats.totalScore,
    totalRecords: challengerStats.totalRecords,
    longestStreak: challengerStats.maxStreak
  }
  
  // 运行 PK 引擎（我是 challenger，挑战者是 defender）
  const result = runPKEngine(myPKStats, challengerPKStats)
  
  // 转换结果视角
  const finalResult = {
    ...result,
    winner: result.winner === 'challenger' ? 'me' : result.winner === 'defender' ? 'opponent' : null,
    isDraw: result.isDraw
  }
  
  pkResult.value = finalResult
  
  // 添加到 PK 历史
  await userStore.addNewPKRecord({
    opponentName: '神秘挑战者',
    opponentStats: challengerStats,
    myStats: myPKStats,
    result: finalResult,
    timestamp: Date.now()
  })
  
  // 自动添加为好友
  const existingFriend = friends.value.find(f => f.friendCode === 'challenger')
  if (!existingFriend) {
    await userStore.addNewFriend({
      id: `friend-${Date.now()}`,
      name: '神秘挑战者',
      friendCode: 'challenger',
      totalScore: challengerStats.totalScore,
      totalRecords: challengerStats.totalRecords,
      addedAt: Date.now()
    })
  }
  
  // 获得勋章
  if (result.medal) {
    await userStore.saveNewPKMedal(result.medal)
  }
  
  pendingPK.value = null
}

function declinePK() {
  pendingPK.value = null
}

function clearPKResult() {
  pkResult.value = null
}

async function challengeFriend(friend) {
  const myPKStats = {
    totalScore: myStats.value.totalScore,
    totalRecords: myStats.value.totalRecords,
    longestStreak: myStats.value.maxStreak
  }
  
  const friendPKStats = {
    totalScore: friend.totalScore,
    totalRecords: friend.totalRecords,
    longestStreak: 0 // 好友数据可能没有这个字段
  }
  
  const result = runPKEngine(myPKStats, friendPKStats)
  
  const finalResult = {
    ...result,
    winner: result.winner === 'challenger' ? 'me' : result.winner === 'defender' ? 'opponent' : null,
    isDraw: result.isDraw
  }
  
  pkResult.value = finalResult
  
  await userStore.addNewPKRecord({
    opponentName: friend.name,
    opponentStats: friendPKStats,
    myStats: myPKStats,
    result: finalResult,
    timestamp: Date.now()
  })
  
  if (result.medal) {
    await userStore.saveNewPKMedal(result.medal)
  }
}

function formatPKTime(timestamp) {
  return formatDate(timestamp, 'YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.friends-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #667eea;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pk-invitation, .pk-result {
  background: linear-gradient(135deg, #fff8dc 0%, #fffaf0 100%);
  border: 2px solid #ffd700;
}

.pk-invitation h3, .pk-result h2 {
  text-align: center;
  margin-bottom: 15px;
}

.challenger-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}

.pk-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.pk-dimensions {
  margin-bottom: 15px;
}

.dimension {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.dimension .winner {
  color: #667eea;
  font-weight: bold;
}

.random-event, .medal-earned {
  text-align: center;
  padding: 10px;
  background: #f0f8ff;
  border-radius: 8px;
  margin: 10px 0;
}

.tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.tab {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.tab.active {
  background: #667eea;
  color: white;
}

.tab-content {
  min-height: 300px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-full {
  width: 100%;
}

.battle-link-section {
  margin-top: 15px;
}

.link-display {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  word-break: break-all;
  font-family: monospace;
  font-size: 12px;
  margin-bottom: 10px;
}

.battle-actions {
  display: flex;
  gap: 10px;
}

.my-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.friend-avatar {
  font-size: 36px;
}

.friend-info {
  flex: 1;
}

.friend-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.friend-stats {
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 15px;
}

.pk-history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pk-record {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pk-result-emoji {
  font-size: 32px;
}

.pk-info {
  flex: 1;
}

.pk-time {
  font-size: 12px;
  color: #666;
}

.pk-outcome {
  font-weight: bold;
}

.medals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.medal-item {
  text-align: center;
}

.medal-emoji {
  font-size: 48px;
  margin-bottom: 10px;
}

.medal-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.medal-desc {
  font-size: 12px;
  color: #666;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.leaderboard-item.top3 {
  background: linear-gradient(135deg, #fff8dc 0%, #fffaf0 100%);
}

.leaderboard-item.me {
  border: 2px solid #667eea;
}

.rank {
  width: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}

.leaderboard-avatar {
  font-size: 28px;
}

.leaderboard-info {
  flex: 1;
}

.leaderboard-name {
  font-weight: 600;
}

.leaderboard-score {
  font-weight: bold;
  color: #667eea;
}
</style>
