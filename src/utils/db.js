const DB_NAME = 'poop-logger-db'
const DB_VERSION = 2
const STORES = {
  records: 'records',
  friends: 'friends',
  settings: 'settings',
  pkHistory: 'pkHistory',
  pkMedals: 'pkMedals'
}

let db = null

// 打开数据库
export function openDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    console.log('正在打开数据库...')
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error('数据库打开失败:', event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      db = event.target.result
      console.log('数据库打开成功')
      
      // 处理数据库错误
      db.onerror = (event) => {
        console.error('数据库错误:', event.target.error)
      }
      
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      console.log('数据库升级中...')
      const database = event.target.result
      const oldVersion = event.oldVersion

      // 创建 records store
      if (!database.objectStoreNames.contains(STORES.records)) {
        const recordsStore = database.createObjectStore(STORES.records, { keyPath: 'id', autoIncrement: true })
        recordsStore.createIndex('timestamp', 'timestamp', { unique: false })
        console.log('创建 records store')
      }

      // 创建 friends store
      if (!database.objectStoreNames.contains(STORES.friends)) {
        database.createObjectStore(STORES.friends, { keyPath: 'id' })
        console.log('创建 friends store')
      }

      // 创建 settings store
      if (!database.objectStoreNames.contains(STORES.settings)) {
        database.createObjectStore(STORES.settings, { keyPath: 'key' })
        console.log('创建 settings store')
      }

      // 版本 2 升级：添加 PK 相关 stores
      if (oldVersion < 2) {
        // 创建 pkHistory store
        if (!database.objectStoreNames.contains(STORES.pkHistory)) {
          const pkHistoryStore = database.createObjectStore(STORES.pkHistory, { keyPath: 'id', autoIncrement: true })
          pkHistoryStore.createIndex('timestamp', 'timestamp', { unique: false })
          console.log('创建 pkHistory store')
        }

        // 创建 pkMedals store
        if (!database.objectStoreNames.contains(STORES.pkMedals)) {
          database.createObjectStore(STORES.pkMedals, { keyPath: 'id' })
          console.log('创建 pkMedals store')
        }
      }
    }
  })
}

// 添加记录
export async function addRecord(record) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      console.log('添加记录:', record)
      const transaction = db.transaction([STORES.records], 'readwrite')
      const store = transaction.objectStore(STORES.records)
      
      // 创建新对象，不要包含 id 字段（让 autoIncrement 处理）
      const { id, ...rest } = record
      const recordToAdd = {
        ...rest,
        timestamp: record.timestamp || Date.now()
      }
      
      const request = store.add(recordToAdd)
      request.onsuccess = (event) => {
        const newId = event.target.result
        console.log('记录添加成功，ID:', newId)
        resolve(newId)
      }
      request.onerror = (event) => {
        console.error('记录添加失败:', event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      console.error('添加记录异常:', error)
      reject(error)
    }
  })
}

// 获取所有记录
export async function getAllRecords() {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.records], 'readonly')
      const store = transaction.objectStore(STORES.records)
      const request = store.getAll()
      request.onsuccess = (event) => {
        const result = event.target.result || []
        console.log('获取到记录数:', result.length)
        // 按时间倒序排序
        result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        resolve(result)
      }
      request.onerror = (event) => {
        console.error('获取记录失败:', event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      console.error('获取记录异常:', error)
      reject(error)
    }
  })
}

// 删除记录
export async function deleteRecord(id) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      console.log('删除记录，ID:', id)
      const transaction = db.transaction([STORES.records], 'readwrite')
      const store = transaction.objectStore(STORES.records)
      const request = store.delete(id)
      request.onsuccess = () => {
        console.log('记录删除成功')
        resolve()
      }
      request.onerror = (event) => {
        console.error('删除记录失败:', event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      console.error('删除记录异常:', error)
      reject(error)
    }
  })
}

// 保存设置
export async function saveSetting(key, value) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.settings], 'readwrite')
      const store = transaction.objectStore(STORES.settings)
      const request = store.put({ key, value })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 获取设置
export async function getSetting(key, defaultValue = null) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.settings], 'readonly')
      const store = transaction.objectStore(STORES.settings)
      const request = store.get(key)
      request.onsuccess = (event) => {
        const result = event.target.result
        resolve(result ? result.value : defaultValue)
      }
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 添加好友
export async function addFriend(friend) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.friends], 'readwrite')
      const store = transaction.objectStore(STORES.friends)
      const request = store.put(friend)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 获取所有好友
export async function getAllFriends() {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.friends], 'readonly')
      const store = transaction.objectStore(STORES.friends)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 删除好友
export async function deleteFriend(id) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.friends], 'readwrite')
      const store = transaction.objectStore(STORES.friends)
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 清空所有数据（用于测试）
export async function clearAllData() {
  console.log('清空所有数据...')
  await openDB()
  const stores = Object.values(STORES)
  
  for (const storeName of stores) {
    try {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()
        request.onsuccess = () => {
          console.log(`清空 store ${storeName} 成功`)
          resolve()
        }
        request.onerror = (event) => {
          console.warn(`清空 store ${storeName} 时出错:`, event.target.error)
          resolve() // 继续处理其他 store
        }
      })
    } catch (error) {
      console.warn(`清空 store ${storeName} 时出错:`, error)
      // 继续处理其他 store
    }
  }
  
  // 重置数据库连接
  console.log('重置数据库连接...')
  db = null
}

// 导出所有数据
export async function exportAllData() {
  const records = await getAllRecords()
  const friends = await getAllFriends()
  const settings = {}
  
  // 获取所有设置
  await openDB()
  const settingsTransaction = db.transaction([STORES.settings], 'readonly')
  const settingsStore = settingsTransaction.objectStore(STORES.settings)
  
  await new Promise((resolve) => {
    const request = settingsStore.openCursor()
    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        settings[cursor.value.key] = cursor.value.value
        cursor.continue()
      } else {
        resolve()
      }
    }
  })

  return {
    version: '2.0',
    exportDate: new Date().toISOString(),
    records,
    friends,
    settings
  }
}

// 添加 PK 历史记录
export async function addPKRecord(pkRecord) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      console.log('添加 PK 记录:', pkRecord)
      const transaction = db.transaction([STORES.pkHistory], 'readwrite')
      const store = transaction.objectStore(STORES.pkHistory)
      
      const { id, ...rest } = pkRecord
      const recordToAdd = {
        ...rest,
        timestamp: pkRecord.timestamp || Date.now()
      }
      
      const request = store.add(recordToAdd)
      request.onsuccess = (event) => {
        const newId = event.target.result
        console.log('PK 记录添加成功，ID:', newId)
        resolve(newId)
      }
      request.onerror = (event) => {
        console.error('PK 记录添加失败:', event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      console.error('添加 PK 记录异常:', error)
      reject(error)
    }
  })
}

// 获取所有 PK 历史记录
export async function getAllPKRecords() {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.pkHistory], 'readonly')
      const store = transaction.objectStore(STORES.pkHistory)
      const request = store.getAll()
      request.onsuccess = (event) => {
        const result = event.target.result || []
        console.log('获取到 PK 记录数:', result.length)
        result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        resolve(result)
      }
      request.onerror = (event) => {
        console.error('获取 PK 记录失败:', event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      console.error('获取 PK 记录异常:', error)
      reject(error)
    }
  })
}

// 添加/更新 PK 勋章
export async function savePKMedal(medal) {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.pkMedals], 'readwrite')
      const store = transaction.objectStore(STORES.pkMedals)
      const request = store.put(medal)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 获取所有 PK 勋章
export async function getAllPKMedals() {
  await openDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORES.pkMedals], 'readonly')
      const store = transaction.objectStore(STORES.pkMedals)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

// 导入数据
export async function importData(data) {
  if (!data || data.version !== '2.0') {
    throw new Error('无效的数据格式')
  }

  // 导入记录
  if (data.records && data.records.length > 0) {
    for (const record of data.records) {
      await addRecord(record)
    }
  }

  // 导入好友
  if (data.friends && data.friends.length > 0) {
    for (const friend of data.friends) {
      await addFriend(friend)
    }
  }

  // 导入设置
  if (data.settings) {
    for (const [key, value] of Object.entries(data.settings)) {
      await saveSetting(key, value)
    }
  }
}
