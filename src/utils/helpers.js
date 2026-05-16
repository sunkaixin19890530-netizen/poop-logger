import { POOP_TYPES, ACHIEVEMENTS } from './constants'

// 计算统计数据
export function calculateStats(records) {
  if (!records || records.length === 0) {
    return {
      totalRecords: 0,
      totalScore: 0,
      maxStreak: 0,
      currentStreak: 0,
      earlyBirdCount: 0,
      nightOwlCount: 0,
      maxPerfectStreak: 0,
      currentPerfectStreak: 0,
      marathonCount: 0,
      flashCount: 0,
      collectedTypes: [],
      viewedOldRecord: false,
      avgDuration: 0,
      avgScore: 0
    }
  }

  let totalScore = 0
  let maxStreak = 0
  let currentStreak = 0
  let earlyBirdCount = 0
  let nightOwlCount = 0
  let maxPerfectStreak = 0
  let currentPerfectStreak = 0
  let marathonCount = 0
  let flashCount = 0
  const collectedTypes = new Set()
  let totalDuration = 0

  // 按时间排序（旧到新）
  const sortedRecords = [...records].sort((a, b) => a.timestamp - b.timestamp)
  let lastDate = null

  for (const record of sortedRecords) {
    totalScore += record.score || 0
    collectedTypes.add(record.typeId)

    // 计算连续打卡
    const recordDate = new Date(record.timestamp).toDateString()
    if (lastDate) {
      const last = new Date(lastDate)
      const current = new Date(recordDate)
      const diffDays = Math.floor((current - last) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        currentStreak++
      } else if (diffDays > 1) {
        currentStreak = 1
      }
    } else {
      currentStreak = 1
    }
    maxStreak = Math.max(maxStreak, currentStreak)
    lastDate = recordDate

    // 早起鸟/夜猫子
    const hour = new Date(record.timestamp).getHours()
    if (hour >= 6 && hour < 8) {
      earlyBirdCount++
    } else if (hour >= 0 && hour < 4) {
      nightOwlCount++
    }

    // 完美香蕉连续
    if (record.typeId === 1) {
      currentPerfectStreak++
    } else {
      currentPerfectStreak = 0
    }
    maxPerfectStreak = Math.max(maxPerfectStreak, currentPerfectStreak)

    // 马拉松/闪电侠
    const duration = record.duration || 0
    totalDuration += duration
    if (duration > 30) {
      marathonCount++
    } else if (duration < 2 && duration > 0) {
      flashCount++
    }
  }

  // 检查是否有一年前的记录
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000
  const viewedOldRecord = records.some(r => r.timestamp < oneYearAgo)

  return {
    totalRecords: records.length,
    totalScore,
    maxStreak,
    currentStreak,
    earlyBirdCount,
    nightOwlCount,
    maxPerfectStreak,
    currentPerfectStreak,
    marathonCount,
    flashCount,
    collectedTypes: Array.from(collectedTypes),
    viewedOldRecord,
    avgDuration: records.length > 0 ? totalDuration / records.length : 0,
    avgScore: records.length > 0 ? totalScore / records.length : 0
  }
}

// 检查解锁的成就
export function checkUnlockedAchievements(stats) {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(stats))
}

// 获取今日任务
export function getDailyTasks() {
  const today = new Date().toDateString()
  const tasks = [
    {
      id: 'morning-poop',
      name: '早起拉屎',
      description: '今天早上8点前拉屎',
      reward: 50,
      check: (records) => {
        const todayRecords = records.filter(r => {
          const recordDate = new Date(r.timestamp).toDateString()
          const hour = new Date(r.timestamp).getHours()
          return recordDate === today && hour < 8
        })
        return todayRecords.length > 0
      }
    },
    {
      id: 'full-env',
      name: '详细记录',
      description: '记录至少3个环境因素',
      reward: 30,
      check: (records) => {
        const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === today)
        return todayRecords.some(r => {
          let envCount = 0
          if (r.environment?.music) envCount++
          if (r.environment?.temperature) envCount++
          if (r.environment?.airQuality) envCount++
          if (r.environment?.activity) envCount++
          if (r.environment?.posture) envCount++
          return envCount >= 3
        })
      }
    },
    {
      id: 'perfect-poop',
      name: '完美香蕉',
      description: '今天获得完美香蕉',
      reward: 100,
      check: (records) => {
        const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === today)
        return todayRecords.some(r => r.typeId === 1)
      }
    }
  ]
  return tasks
}

// 生成随机 ID
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 格式化日期
export function formatDate(timestamp, format = 'YYYY-MM-DD HH:mm') {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
}

// 获取时间描述
export function getTimeDescription(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return formatDate(timestamp, 'YYYY-MM-DD')
}
