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
