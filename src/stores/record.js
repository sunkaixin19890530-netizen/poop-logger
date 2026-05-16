import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllRecords, addRecord, deleteRecord } from '../utils/db'
import { calculateStats, checkUnlockedAchievements, getDailyTasks } from '../utils/helpers'
import { POOP_TYPES } from '../utils/constants'

export const useRecordStore = defineStore('records', () => {
  const records = ref([])
  const loading = ref(false)

  // 获取所有记录
  async function fetchRecords() {
    loading.value = true
    try {
      records.value = await getAllRecords()
    } finally {
      loading.value = false
    }
  }

  // 添加记录
  async function addNewRecord(record) {
    const type = POOP_TYPES.find(t => t.id === record.typeId)
    const newRecord = {
      ...record,
      score: type?.score || 0
    }
    const id = await addRecord(newRecord)
    await fetchRecords()
    return id
  }

  // 删除记录
  async function removeRecord(id) {
    await deleteRecord(id)
    await fetchRecords()
  }

  // 统计数据
  const stats = computed(() => calculateStats(records.value))

  // 解锁的成就
  const unlockedAchievements = computed(() => checkUnlockedAchievements(stats.value))

  // 今日任务
  const dailyTasks = computed(() => {
    const tasks = getDailyTasks()
    return tasks.map(task => ({
      ...task,
      completed: task.check(records.value)
    }))
  })

  // 今日完成任务获得的积分
  const todayTaskScore = computed(() => {
    return dailyTasks.value
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.reward, 0)
  })

  return {
    records,
    loading,
    stats,
    unlockedAchievements,
    dailyTasks,
    todayTaskScore,
    fetchRecords,
    addNewRecord,
    removeRecord
  }
})
