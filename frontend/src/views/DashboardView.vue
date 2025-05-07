<!--<template>-->
<!--  <div class="dashboard-container">-->
<!--    <div class="dashboard-header">-->
<!--      <h2>Welcome back, {{ user.username }}!</h2>-->
<!--      <p class="welcome-message">You're now logged in to your account.</p>-->
<!--    </div>-->

<!--    <div class="dashboard-content">-->
<!--      &lt;!&ndash; Placeholder for dashboard content &ndash;&gt;-->
<!--      <div class="stats-card">-->
<!--        <h3>Your Stats</h3>-->
<!--        <p>Member since: {{ formatDate(user.createdAt) }}</p>-->
<!--      </div>-->
<!--    </div>-->

<!--    <button @click="handleLogout" class="logout-button">-->
<!--      <span v-if="!loggingOut">Logout</span>-->
<!--      <span v-else>Logging out...</span>-->
<!--    </button>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { mapGetters, mapActions } from 'vuex'-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      loggingOut: false-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapGetters('auth', ['user'])-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions('auth', ['logout']),-->
<!--    formatDate(dateString) {-->
<!--      if (!dateString) return 'N/A'-->
<!--      return new Date(dateString).toLocaleDateString()-->
<!--    },-->
<!--    async handleLogout() {-->
<!--      this.loggingOut = true-->
<!--      try {-->
<!--        await this.logout()-->
<!--        this.$router.push('/login')-->
<!--      } catch (error) {-->
<!--        console.error('Logout failed:', error)-->
<!--      } finally {-->
<!--        this.loggingOut = false-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.dashboard-container {-->
<!--  max-width: 800px;-->
<!--  margin: 2rem auto;-->
<!--  padding: 2rem;-->
<!--  background-color: #f8f9fa;-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.dashboard-header {-->
<!--  text-align: center;-->
<!--  margin-bottom: 2rem;-->
<!--}-->

<!--.dashboard-header h2 {-->
<!--  color: #2c3e50;-->
<!--  margin-bottom: 0.5rem;-->
<!--}-->

<!--.welcome-message {-->
<!--  color: #7f8c8d;-->
<!--  font-size: 1.1rem;-->
<!--}-->

<!--.dashboard-content {-->
<!--  margin: 2rem 0;-->
<!--}-->

<!--.stats-card {-->
<!--  background: white;-->
<!--  padding: 1.5rem;-->
<!--  border-radius: 6px;-->
<!--  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);-->
<!--  margin-bottom: 1.5rem;-->
<!--}-->

<!--.stats-card h3 {-->
<!--  color: #3498db;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.logout-button {-->
<!--  display: block;-->
<!--  width: 100%;-->
<!--  padding: 0.75rem;-->
<!--  background-color: #e74c3c;-->
<!--  color: white;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--  font-size: 1rem;-->
<!--  cursor: pointer;-->
<!--  transition: background-color 0.3s ease;-->
<!--}-->

<!--.logout-button:hover {-->
<!--  background-color: #c0392b;-->
<!--}-->

<!--.logout-button:disabled {-->
<!--  background-color: #95a5a6;-->
<!--  cursor: not-allowed;-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .dashboard-container {-->
<!--    padding: 1.5rem;-->
<!--    margin: 1rem;-->
<!--  }-->
<!--}-->
<!--</style>-->

<template>
  <el-container class="dashboard-container">
    <!-- Sidebar -->
    <el-aside width="200px" class="sidebar">
      <div class="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><pie-chart /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="users">
          <el-icon><user /></el-icon>
          <span>Users</span>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><setting /></el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="collapseSidebar"
            class="collapse-btn"
          >
            <el-icon><fold v-if="!isCollapsed" /><expand v-else /></el-icon>
          </el-button>
          <h3 class="page-title">{{ currentPageTitle }}</h3>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="30" :src="userAvatar" />
              <span class="username">{{ userName }}</span>
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Profile</el-dropdown-item>
                <el-dropdown-item>Settings</el-dropdown-item>
                <el-dropdown-item divided @click="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="main-content">
        <router-view />
      </el-main>

      <!-- Footer -->
      <el-footer class="footer">
        <div class="footer-content">
          <p>© 2023 Your Company. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  PieChart,
  User,
  Setting,
  Fold,
  Expand,
  ArrowDown
} from '@element-plus/icons-vue'

export default {
  name: 'DashboardLayout',
  components: {
    PieChart,
    User,
    Setting,
    Fold,
    Expand,
    ArrowDown
  },
  setup() {
    const router = useRouter()
    const isCollapsed = ref(false)
    const activeMenu = ref('dashboard')
    const userName = ref('Admin User')
    const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

    const pageTitles = {
      dashboard: 'Dashboard Overview',
      users: 'User Management',
      settings: 'System Settings'
    }

    const currentPageTitle = computed(() => {
      return pageTitles[activeMenu.value] || 'Dashboard'
    })

    const collapseSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const handleMenuSelect = (index) => {
      activeMenu.value = index
      router.push({ name: index })
    }

    const logout = () => {
      console.log('Logging out...')
      // Add your logout logic here
    }

    return {
      isCollapsed,
      activeMenu,
      userName,
      userAvatar,
      currentPageTitle,
      collapseSidebar,
      handleMenuSelect,
      logout
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: white;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 64px !important;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu {
  border-right: none;
  background-color: transparent;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 18px;
  margin-right: 16px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.username {
  margin: 0 8px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-top: 1px solid #e6e6e6;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.footer-links a {
  margin-left: 16px;
  color: #606266;
  text-decoration: none;
}

.footer-links a:hover {
  color: #409eff;
}

.el-menu-item {
  color: #bfcbd9;
}

.el-menu-item.is-active {
  color: #409eff;
  background-color: #263445 !important;
}

.el-menu-item:hover {
  background-color: #263445 !important;
}
</style>