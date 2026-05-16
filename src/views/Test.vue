<template>
  <div class="test-page">
    <h1 class="page-title">🧪 单元测试</h1>
    
    <div class="section">
      <h2>测试结果</h2>
      <div class="test-summary" v-if="testResults.length > 0">
        <span class="passed-count">✅ 通过: {{ passedCount }}</span>
        <span class="failed-count">❌ 失败: {{ failedCount }}</span>
        <span class="total-count">总计: {{ testResults.length }}</span>
      </div>
      <div class="test-results">
        <div 
          v-for="test in testResults" 
          :key="test.name"
          class="test-item"
          :class="{ passed: test.passed, failed: !test.passed }"
        >
          <span class="test-icon">{{ test.passed ? '✅' : '❌' }}</span>
          <div class="test-info">
            <div class="test-name">{{ test.name }}</div>
            <div class="test-message" v-if="test.message">{{ test.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>操作</h2>
      <div class="buttons">
        <button class="btn btn-primary" @click="runTests" :disabled="running">
          {{ running ? '运行中...' : '运行所有测试' }}
        </button>
        <button class="btn btn-secondary" @click="clearTestData">
          清空测试数据
        </button>
      </div>
    </div>

    <div class="section" v-if="testRecords.length > 0">
      <h2>测试数据</h2>
      <div class="data-preview">
        <pre>{{ JSON.stringify(testRecords, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { addRecord, getAllRecords, deleteRecord, clearAllData, openDB } from '../utils/db'
import { POOP_TYPES } from '../utils/constants'
import { calculateStats } from '../utils/helpers'

const testResults = ref([])
const testRecords = ref([])
const running = ref(false)

const passedCount = computed(() => testResults.value.filter(t => t.passed).length)
const failedCount = computed(() => testResults.value.filter(t => !t.passed).length)

onMounted(() => {
  // 页面加载时不自动运行测试
})

async function runTests() {
  running.value = true
  testResults.value = []
  
  try {
    // 第一步：清空并初始化数据库
    await openDB()
    await delay(200)
    await clearAllData()
    await delay(300)
    
    // 测试 1: 数据库初始化和清空
    await testDatabaseInit()
    
    // 测试 2: 添加单个记录
    await testAddSingleRecord()
    await delay(150)
    
    // 测试 3: 添加多个记录
    await testAddMultipleRecords()
    await delay(150)
    
    // 测试 4: 获取所有记录
    await testGetAllRecords()
    
    // 测试 5: 删除记录
    await testDeleteRecord()
    await delay(150)
    
    // 测试 6: 统计计算
    await testStatsCalculation()
    
    // 测试 7: 屎相数据完整性
    await testPoopTypes()
    
    // 获取最终数据用于展示
    testRecords.value = await getAllRecords()
    
  } catch (error) {
    console.error('测试运行失败:', error)
    testResults.value.push({
      name: '测试运行异常',
      passed: false,
      message: error.message || '未知错误'
    })
  } finally {
    running.value = false
  }
}

async function clearTestData() {
  if (confirm('确定要清空所有测试数据吗？')) {
    await clearAllData()
    testRecords.value = []
    testResults.value = []
    alert('数据已清空')
  }
}

async function testDatabaseInit() {
  try {
    const records = await getAllRecords()
    const isEmpty = records.length === 0
    testResults.value.push({
      name: '数据库初始化',
      passed: Array.isArray(records) && isEmpty,
      message: `初始化成功，当前 ${records.length} 条记录`
    })
  } catch (error) {
    console.error('数据库初始化测试失败:', error)
    testResults.value.push({
      name: '数据库初始化',
      passed: false,
      message: error.message
    })
  }
}

async function testAddSingleRecord() {
  try {
    const testRecord = {
      typeId: 1,
      typeName: '完美香蕉',
      typeEmoji: '🍌',
      score: 100,
      duration: 5,
      notes: '测试记录',
      environment: {}
    }
    
    const id = await addRecord(testRecord)
    await delay(100)
    const records = await getAllRecords()
    const wasAdded = records.some(r => r.id === id)
    
    testResults.value.push({
      name: '添加单个记录',
      passed: id !== undefined && id !== null && wasAdded,
      message: `记录添加成功，ID: ${id}`
    })
  } catch (error) {
    console.error('添加单个记录测试失败:', error)
    testResults.value.push({
      name: '添加单个记录',
      passed: false,
      message: error.message
    })
  }
}

async function testAddMultipleRecords() {
  try {
    const initialRecords = await getAllRecords()
    const initialCount = initialRecords.length
    
    const recordsToAdd = [
      { typeId: 2, typeName: '一气呵成', typeEmoji: '🚀', score: 80, duration: 3, environment: {} },
      { typeId: 3, typeName: '分道扬镳', typeEmoji: '🎭', score: 60, duration: 8, environment: {} },
      { typeId: 4, typeName: '软乎乎', typeEmoji: '🧈', score: 40, duration: 4, environment: {} }
    ]
    
    let successCount = 0
    for (const record of recordsToAdd) {
      const id = await addRecord(record)
      if (id !== undefined && id !== null) successCount++
      await delay(50)
    }
    
    const finalRecords = await getAllRecords()
    const finalCount = finalRecords.length
    
    testResults.value.push({
      name: '添加多个记录',
      passed: successCount === recordsToAdd.length && finalCount === initialCount + recordsToAdd.length,
      message: `成功添加 ${successCount}/${recordsToAdd.length} 条记录，总数从 ${initialCount} 变为 ${finalCount}`
    })
  } catch (error) {
    console.error('添加多个记录测试失败:', error)
    testResults.value.push({
      name: '添加多个记录',
      passed: false,
      message: error.message
    })
  }
}

async function testGetAllRecords() {
  try {
    const records = await getAllRecords()
    testResults.value.push({
      name: '获取所有记录',
      passed: Array.isArray(records) && records.length >= 4,
      message: `获取到 ${records.length} 条记录`
    })
  } catch (error) {
    console.error('获取所有记录测试失败:', error)
    testResults.value.push({
      name: '获取所有记录',
      passed: false,
      message: error.message
    })
  }
}

async function testDeleteRecord() {
  try {
    const records = await getAllRecords()
    if (records.length > 0) {
      const idToDelete = records[0].id
      const initialLength = records.length
      
      await deleteRecord(idToDelete)
      await delay(100)
      
      const newRecords = await getAllRecords()
      const stillExists = newRecords.some(r => r.id === idToDelete)
      
      testResults.value.push({
        name: '删除记录',
        passed: !stillExists && newRecords.length === initialLength - 1,
        message: `删除成功，记录数从 ${initialLength} 变为 ${newRecords.length}`
      })
    } else {
      testResults.value.push({
        name: '删除记录',
        passed: false,
        message: '没有记录可删除'
      })
    }
  } catch (error) {
    console.error('删除记录测试失败:', error)
    testResults.value.push({
      name: '删除记录',
      passed: false,
      message: error.message
    })
  }
}

async function testStatsCalculation() {
  try {
    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000
    const testRecordsData = [
      { typeId: 1, score: 100, duration: 5, timestamp: now - dayInMs },
      { typeId: 2, score: 80, duration: 3, timestamp: now - (2 * dayInMs) },
      { typeId: 1, score: 100, duration: 6, timestamp: now }
    ]
    
    const stats = calculateStats(testRecordsData)
    const isValid = stats.totalRecords === 3 && 
                    stats.totalScore === 280 && 
                    typeof stats.currentStreak === 'number' &&
                    typeof stats.maxStreak === 'number' &&
                    stats.collectedTypes.length >= 2
    
    testResults.value.push({
      name: '统计计算',
      passed: isValid,
      message: `总记录: ${stats.totalRecords}, 总分数: ${stats.totalScore}, 当前连续: ${stats.currentStreak}`
    })
  } catch (error) {
    console.error('统计计算测试失败:', error)
    testResults.value.push({
      name: '统计计算',
      passed: false,
      message: error.message
    })
  }
}

async function testPoopTypes() {
  try {
    const isValid = Array.isArray(POOP_TYPES) && 
                    POOP_TYPES.length === 7 &&
                    POOP_TYPES.every(t => t.id && t.name && t.emoji && t.score !== undefined)
    
    testResults.value.push({
      name: '屎相数据完整性',
      passed: isValid,
      message: `共 ${POOP_TYPES.length} 种屎相类型`
    })
  } catch (error) {
    console.error('屎相数据完整性测试失败:', error)
    testResults.value.push({
      name: '屎相数据完整性',
      passed: false,
      message: error.message
    })
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style scoped>
.test-page {
  padding: 20px;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.section h2 {
  margin: 0 0 16px 0;
  color: #333;
}

.test-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.passed-count {
  color: #4caf50;
  font-weight: 600;
}

.failed-count {
  color: #f44336;
  font-weight: 600;
}

.total-count {
  color: #666;
  font-weight: 600;
}

.test-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
}

.test-item.passed {
  background: #e8f5e9;
  border: 1px solid #4caf50;
}

.test-item.failed {
  background: #ffebee;
  border: 1px solid #f44336;
}

.test-icon {
  font-size: 24px;
}

.test-info {
  flex: 1;
}

.test-name {
  font-weight: 600;
  color: #333;
}

.test-message {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.data-preview {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.data-preview pre {
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
}
</style>