// 屎相数据
export const POOP_TYPES = [
  { id: 1, name: '完美香蕉', emoji: '🍌', description: '形状完美，色泽金黄，不软不硬', score: 100 },
  { id: 2, name: '一气呵成', emoji: '🚀', description: '顺畅到底，一气呵成', score: 80 },
  { id: 3, name: '分道扬镳', emoji: '🎭', description: '分成两段，但都很健康', score: 60 },
  { id: 4, name: '软乎乎', emoji: '🧈', description: '有点软，但成型', score: 40 },
  { id: 5, name: '小绵羊', emoji: '🐑', description: '颗粒状，有点干', score: 20 },
  { id: 6, name: '艰难险阻', emoji: '🏔️', description: '便秘，努力很久', score: -10 },
  { id: 7, name: '稀里哗啦', emoji: '💧', description: '腹泻，完全不成型', score: -30 }
]

// 环境选项
export const ENV_OPTIONS = {
  music: ['无', '白噪音', '轻音乐', '自然声', '其他'],
  temperature: ['冰', '凉', '温', '热', '烫'],
  airQuality: ['无味', '有味', '爆炸级'],
  activity: ['刷手机', '看书', '冥想', '玩手机游戏', '其他'],
  posture: ['坐姿', '蹲姿', '其他']
}

// 成就数据
export const ACHIEVEMENTS = [
  { id: 'daily-poop', name: '每日一屎', emoji: '📅', description: '连续7天每天都有记录', condition: (stats) => stats.maxStreak >= 7 },
  { id: 'early-bird', name: '早起鸟', emoji: '🐦', description: '早上6-8点之间拉屎10次', condition: (stats) => stats.earlyBirdCount >= 10 },
  { id: 'night-owl', name: '夜猫子', emoji: '🌙', description: '凌晨0-4点之间拉屎10次', condition: (stats) => stats.nightOwlCount >= 10 },
  { id: 'perfectionist', name: '完美主义者', emoji: '💯', description: '连续10次都是完美香蕉', condition: (stats) => stats.maxPerfectStreak >= 10 },
  { id: 'marathon', name: '马拉松选手', emoji: '🏃', description: '单次拉屎超过30分钟（5次）', condition: (stats) => stats.marathonCount >= 5 },
  { id: 'flash', name: '闪电侠', emoji: '⚡', description: '单次拉屎少于2分钟（10次）', condition: (stats) => stats.flashCount >= 10 },
  { id: 'poop-king', name: '屎王', emoji: '👑', description: '总得分超过10000分', condition: (stats) => stats.totalScore >= 10000 },
  { id: 'collector', name: '收藏夹', emoji: '📚', description: '收集所有屎相类型', condition: (stats) => stats.collectedTypes.length >= 7 },
  { id: 'archaeologist', name: '考古学家', emoji: '🔍', description: '查看一年前的记录', condition: (stats) => stats.viewedOldRecord }
]

// 马桶皮肤
export const TOILET_SKINS = [
  { id: 'default', name: '普通马桶', emoji: '🚽', unlocked: true, cost: 0 },
  { id: 'golden', name: '金色马桶', emoji: '👑', unlocked: false, cost: 1000 },
  { id: 'cartoon', name: '卡通马桶', emoji: '🎨', unlocked: false, cost: 500 },
  { id: 'scifi', name: '科幻马桶', emoji: '🚀', unlocked: false, cost: 2000 },
  { id: 'nature', name: '自然马桶', emoji: '🌿', unlocked: false, cost: 800 }
]
