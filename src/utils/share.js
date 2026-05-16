import html2canvas from 'html2canvas'

// 编码数据为 URL 参数
export function encodeShareData(data) {
  const jsonStr = JSON.stringify(data)
  const base64 = btoa(encodeURIComponent(jsonStr))
  return base64
}

// 解码 URL 参数数据
export function decodeShareData(base64) {
  try {
    const jsonStr = decodeURIComponent(atob(base64))
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('解码分享数据失败:', e)
    return null
  }
}

// 生成分享链接
export function generateShareLink(type, data) {
  const shareData = {
    type,
    data,
    timestamp: Date.now()
  }
  const encoded = encodeShareData(shareData)
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}#/share?data=${encoded}`
}

// 生成好友码
export function generateFriendCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// 将 HTML 元素转换为图片
export async function elementToImage(element) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  })
  return canvas.toDataURL('image/png')
}

// 下载图片
export function downloadImage(dataUrl, filename = 'poop-logger.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

// 分享图片（复制到剪贴板或下载）
export async function shareImage(element, filename = 'poop-logger.png') {
  try {
    const dataUrl = await elementToImage(element)
    
    // 尝试使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.write) {
      const blob = await (await fetch(dataUrl)).blob()
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        return { success: true, method: 'clipboard' }
      } catch (e) {
        console.log('剪贴板分享失败，使用下载方式')
      }
    }
    
    // 回退到下载
    downloadImage(dataUrl, filename)
    return { success: true, method: 'download' }
  } catch (e) {
    console.error('分享失败:', e)
    return { success: false, error: e }
  }
}

// 生成分享卡片数据
export function generateAchievementCard(achievement, stats) {
  return {
    type: 'achievement',
    achievement,
    stats,
    date: new Date().toLocaleDateString('zh-CN')
  }
}

export function generateStatsCard(stats) {
  return {
    type: 'stats',
    stats,
    date: new Date().toLocaleDateString('zh-CN')
  }
}

export function generateChallengeCard(challenge) {
  return {
    type: 'challenge',
    challenge,
    date: new Date().toLocaleDateString('zh-CN')
  }
}

// 生成 PK 挑战数据
export function generatePKChallenge(myStats, taunt = '来一场屎命召唤吧！') {
  return {
    type: 'pk_challenge',
    payload: {
      challengeId: `pk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      stats: myStats,
      taunt,
      timestamp: Date.now()
    },
    signature: btoa(`${myStats.totalScore}-${Date.now()}`) // 简单签名
  }
}

// 生成 PK 结果数据
export function generatePKResult(challengerStats, defenderStats, result) {
  return {
    type: 'pk_result',
    payload: {
      challengerStats,
      defenderStats,
      result,
      timestamp: Date.now()
    }
  }
}

// 生成战斗链接
export function generateBattleLink(pkData) {
  const encoded = encodeShareData(pkData)
  // 去掉当前 URL 已有的 hash 部分，拼接新的 hash 路由
  const href = (typeof window !== 'undefined' && window.location && window.location.href) || 'http://localhost/'
  const baseUrl = href.split('#')[0]
  return `${baseUrl}#/friends?pk=${encoded}`
}

// 「屎命召唤」PK 引擎
export function runPKEngine(challengerStats, defenderStats) {
  const results = {
    winner: null,
    loser: null,
    isDraw: false,
    dimensions: [],
    randomEvent: null,
    medal: null
  }

  // 1. 数值对决（3个维度）
  const scoreBattle = compareStat(challengerStats.totalScore || 0, defenderStats.totalScore || 0, '总积分')
  const recordsBattle = compareStat(challengerStats.totalRecords || 0, defenderStats.totalRecords || 0, '总记录数')
  const streakBattle = compareStat(challengerStats.longestStreak || 0, defenderStats.longestStreak || 0, '最长连续天数')
  
  results.dimensions.push(scoreBattle, recordsBattle, streakBattle)

  // 2. 随机事件（20%概率触发）
  if (Math.random() < 0.2) {
    const events = [
      { name: '便秘暴击', effect: -30, description: '突然便秘，发挥失常！' },
      { name: '通畅加成', effect: 30, description: '一气呵成，状态爆表！' },
      { name: '马桶 buff', effect: 20, description: '马桶加持，超常发挥！' },
      { name: '手机没电', effect: -20, description: '关键时刻手机没电！' }
    ]
    results.randomEvent = events[Math.floor(Math.random() * events.length)]
  }

  // 计算总分
  let challengerPoints = 0
  let defenderPoints = 0
  
  results.dimensions.forEach(dim => {
    if (dim.winner === 'challenger') challengerPoints += dim.points
    else if (dim.winner === 'defender') defenderPoints += dim.points
    else { challengerPoints += 1; defenderPoints += 1 }
  })

  // 应用随机事件
  if (results.randomEvent) {
    if (Math.random() < 0.5) {
      challengerPoints += results.randomEvent.effect
    } else {
      defenderPoints += results.randomEvent.effect
    }
  }

  // 确定胜负
  if (challengerPoints > defenderPoints) {
    results.winner = 'challenger'
    results.loser = 'defender'
  } else if (defenderPoints > challengerPoints) {
    results.winner = 'defender'
    results.loser = 'challenger'
  } else {
    results.isDraw = true
  }

  // 生成勋章（如果获胜）
  if (results.winner === 'challenger' && Math.random() < 0.3) {
    const medals = [
      { id: 'crusher', name: '碾压者', emoji: '💪', description: '以绝对优势获胜' },
      { id: 'lucky', name: '运气之王', emoji: '🍀', description: '险胜对手' },
      { id: 'speedster', name: '闪电侠', emoji: '⚡', description: '速战速决' },
      { id: 'marathon', name: '马拉松选手', emoji: '🏃', description: '持久战专家' }
    ]
    results.medal = medals[Math.floor(Math.random() * medals.length)]
  }

  return results
}

function compareStat(challengerVal, defenderVal, name) {
  const result = {
    name,
    challengerValue: challengerVal,
    defenderValue: defenderVal,
    winner: null,
    points: 0
  }

  if (challengerVal > defenderVal) {
    result.winner = 'challenger'
    result.points = 10 + Math.min(Math.floor((challengerVal - defenderVal) / 10), 20)
  } else if (defenderVal > challengerVal) {
    result.winner = 'defender'
    result.points = 10 + Math.min(Math.floor((defenderVal - challengerVal) / 10), 20)
  } else {
    result.winner = 'draw'
    result.points = 5
  }

  return result
}
