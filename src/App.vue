<template>
  <div id="app">
    <nav class="nav-bar">
      <router-link to="/">🏠 首页</router-link>
      <router-link to="/record">💩 记录</router-link>
      <router-link to="/history">📜 历史</router-link>
      <router-link to="/stats">📊 统计</router-link>
      <router-link to="/achievements">🏆 成就</router-link>
      <router-link to="/share">📸 分享</router-link>
      <router-link to="/friends">👥 好友</router-link>
      <router-link to="/shop">🛒 商店</router-link>
      <router-link to="/settings">⚙️ 设置</router-link>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nav-bar {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 10px;
}

.nav-bar a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-bar a:hover,
.nav-bar a.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.main-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
</style>
