import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSetting, saveSetting, getAllFriends, addFriend, deleteFriend } from '../utils/db'
import { TOILET_SKINS } from '../utils/constants'
import { generateFriendCode } from '../utils/share'

export const useUserStore = defineStore('user', () => {
  const username = ref('屎民')
  const friendCode = ref('')
  const points = ref(0)
  const unlockedSkins = ref(['default'])
  const currentSkin = ref('default')
  const friends = ref([])
  const loading = ref(false)

  // 初始化
  async function init() {
    loading.value = true
    try {
      const savedUsername = await getSetting('username', '屎民')
      const savedFriendCode = await getSetting('friendCode', '')
      const savedPoints = await getSetting('points', 0)
      const savedUnlockedSkins = await getSetting('unlockedSkins', ['default'])
      const savedCurrentSkin = await getSetting('currentSkin', 'default')

      username.value = savedUsername
      friendCode.value = savedFriendCode || generateFriendCode()
      points.value = savedPoints
      unlockedSkins.value = savedUnlockedSkins
      currentSkin.value = savedCurrentSkin

      // 如果没有好友码，保存一个
      if (!savedFriendCode) {
        await saveSetting('friendCode', friendCode.value)
      }

      // 加载好友
      friends.value = await getAllFriends()
    } finally {
      loading.value = false
    }
  }

  // 保存用户名
  async function setUsername(name) {
    username.value = name
    await saveSetting('username', name)
  }

  // 增加积分
  async function addPoints(amount) {
    points.value += amount
    await saveSetting('points', points.value)
  }

  // 解锁皮肤
  async function unlockSkin(skinId) {
    const skin = TOILET_SKINS.find(s => s.id === skinId)
    if (!skin || unlockedSkins.value.includes(skinId)) return false
    if (points.value < skin.cost) return false

    points.value -= skin.cost
    unlockedSkins.value.push(skinId)
    
    await saveSetting('points', points.value)
    await saveSetting('unlockedSkins', unlockedSkins.value)
    return true
  }

  // 切换皮肤
  async function setCurrentSkin(skinId) {
    if (!unlockedSkins.value.includes(skinId)) return false
    currentSkin.value = skinId
    await saveSetting('currentSkin', skinId)
    return true
  }

  // 获取当前皮肤信息
  const currentSkinInfo = computed(() => {
    return TOILET_SKINS.find(s => s.id === currentSkin.value) || TOILET_SKINS[0]
  })

  // 获取可用的皮肤
  const availableSkins = computed(() => {
    return TOILET_SKINS.map(skin => ({
      ...skin,
      unlocked: unlockedSkins.value.includes(skin.id)
    }))
  })

  // 添加好友
  async function addNewFriend(friend) {
    await addFriend(friend)
    friends.value = await getAllFriends()
  }

  // 删除好友
  async function removeFriend(id) {
    await deleteFriend(id)
    friends.value = await getAllFriends()
  }

  return {
    username,
    friendCode,
    points,
    unlockedSkins,
    currentSkin,
    currentSkinInfo,
    availableSkins,
    friends,
    loading,
    init,
    setUsername,
    addPoints,
    unlockSkin,
    setCurrentSkin,
    addNewFriend,
    removeFriend
  }
})
