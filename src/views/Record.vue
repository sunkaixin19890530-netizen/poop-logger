<template>
  <div class="record">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>记录拉屎</h1>
      <div class="placeholder"></div>
    </div>

    <div class="form-container">
      <div class="section">
        <h3>选择屎相 💩</h3>
        <div class="poop-types">
          <div 
            v-for="type in POOP_TYPES" 
            :key="type.id" 
            class="poop-type-item"
            :class="{ selected: form.typeId === type.id }"
            @click="selectType(type.id)"
          >
            <span class="poop-emoji">{{ type.emoji }}</span>
            <div class="poop-info">
              <div class="poop-name">{{ type.name }}</div>
              <div class="poop-desc">{{ type.description }}</div>
            </div>
            <span class="poop-score">{{ type.score > 0 ? '+' : '' }}{{ type.score }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>环境记录 🌿</h3>
        <div class="env-grid">
          <div class="env-item">
            <label>背景音乐</label>
            <select v-model="form.environment.music">
              <option value="">请选择</option>
              <option v-for="option in ENV_OPTIONS.music" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="env-item">
            <label>马桶温度</label>
            <select v-model="form.environment.temperature">
              <option value="">请选择</option>
              <option v-for="option in ENV_OPTIONS.temperature" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="env-item">
            <label>空气质量</label>
            <select v-model="form.environment.airQuality">
              <option value="">请选择</option>
              <option v-for="option in ENV_OPTIONS.airQuality" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="env-item">
            <label>娱乐方式</label>
            <select v-model="form.environment.activity">
              <option value="">请选择</option>
              <option v-for="option in ENV_OPTIONS.activity" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="env-item">
            <label>姿势</label>
            <select v-model="form.environment.posture">
              <option value="">请选择</option>
              <option v-for="option in ENV_OPTIONS.posture" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>时长记录 ⏱️</h3>
        <div class="duration-input">
          <input 
            type="number" 
            v-model.number="form.duration" 
            placeholder="分钟"
            min="0"
          />
          <span>分钟</span>
        </div>
      </div>

      <div class="section">
        <h3>备注 📝</h3>
        <textarea 
          v-model="form.notes" 
          placeholder="记录一下今天的感受..."
          rows="4"
        ></textarea>
      </div>

      <button 
        class="save-btn" 
        :disabled="!form.typeId || saving"
        @click="saveRecord"
      >
        {{ saving ? '保存中...' : '保存记录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecordStore } from '../stores/record'
import { useUserStore } from '../stores/user'
import { POOP_TYPES, ENV_OPTIONS } from '../utils/constants'

const router = useRouter()
const recordStore = useRecordStore()
const userStore = useUserStore()

const saving = ref(false)
const initialized = ref(false)

const form = reactive({
  typeId: null,
  environment: {
    music: '',
    temperature: '',
    airQuality: '',
    activity: '',
    posture: ''
  },
  duration: 0,
  notes: ''
})

onMounted(async () => {
  try {
    await Promise.all([
      recordStore.fetchRecords(),
      userStore.init()
    ])
    initialized.value = true
  } catch (error) {
    console.error('初始化失败:', error)
    alert('初始化失败，请刷新页面重试')
  }
})

function goBack() {
  router.back()
}

function selectType(id) {
  form.typeId = id
}

async function saveRecord() {
  if (!form.typeId || saving.value) {
    return
  }

  saving.value = true
  try {
    const type = POOP_TYPES.find(t => t.id === form.typeId)
    if (!type) {
      throw new Error('屎相类型不存在')
    }

    await recordStore.addNewRecord({
      typeId: form.typeId,
      typeName: type.name,
      typeEmoji: type.emoji,
      environment: { ...form.environment },
      duration: form.duration,
      notes: form.notes
    })

    const pointsToAdd = type.score > 0 ? type.score : 0
    if (pointsToAdd > 0) {
      await userStore.addPoints(pointsToAdd)
    }

    // 重置表单
    resetForm()

    alert('保存成功！💩')
    router.push('/')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败：' + (error.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

function resetForm() {
  form.typeId = null
  form.environment = {
    music: '',
    temperature: '',
    airQuality: '',
    activity: '',
    posture: ''
  }
  form.duration = 0
  form.notes = ''
}
</script>

<style scoped>
.record {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
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

.form-container {
  padding: 20px;
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

.poop-types {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poop-type-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.poop-type-item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.poop-emoji {
  font-size: 32px;
}

.poop-info {
  flex: 1;
}

.poop-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.poop-type-item.selected .poop-name,
.poop-type-item.selected .poop-desc {
  color: white;
}

.poop-desc {
  font-size: 14px;
  color: #666;
}

.poop-score {
  font-weight: bold;
  font-size: 18px;
}

.poop-type-item.selected .poop-score {
  color: #ffd700;
}

.env-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.env-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.env-item label {
  font-size: 14px;
  color: #666;
}

.env-item select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.duration-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.duration-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.duration-input span {
  color: #666;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  box-sizing: border-box;
}

.save-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
