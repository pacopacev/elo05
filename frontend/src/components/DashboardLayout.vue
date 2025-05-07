<!-- frontend/src/components/DashboardLayout.vue -->
<template>
  <el-container class="dashboard-container">
    <!-- Sidebar -->
    <el-aside :width="isCollapsed ? '64px' : '250px'" class="sidebar">
      <div class="sidebar-header">
        <h2 v-if="!isCollapsed">Dashboard</h2>
        <el-icon v-else><pie-chart /></el-icon>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
        :collapse="isCollapsed"
        :unique-opened="true"
        router
      >
        <menu-item
          v-for="item in menuData"
          :key="item.id"
          :menu-item="item"
        />
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

<!--       Admin  user-->
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
          <p>&copy; {{currentYear}} Your Company. All rights reserved.</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import {
  PieChart,
  Fold,
  Expand,
  ArrowDown
} from '@element-plus/icons-vue'
import MenuItem from './MenuItem.vue'

export default {

data() {
    return {
      currentYear: new Date().getFullYear()
    }
  },
  name: 'DashboardLayout',
  components: {
    PieChart,
    Fold,
    Expand,
    ArrowDown,
    MenuItem
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isCollapsed = ref(false)
    const activeMenu = ref('')
    const userName = ref('Admin User')
    const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
    const menuData = ref([])

    const currentPageTitle = computed(() => {
      return route.meta.title || 'Dashboard'
    })

    const collapseSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const handleMenuSelect = (index) => {
      activeMenu.value = index
    }

    const logout = () => {
      console.log('Logging out...')
      router.push('/login')
    }

    const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        })
        menuData.value = response.data
        console.log(menuData.value);
      } catch (error) {
        console.error('Error fetching menu data:', error)
      }
    }

    onMounted(() => {
      fetchMenuData()
      activeMenu.value = route.path
    })

    return {
      isCollapsed,
      activeMenu,
      userName,
      userAvatar,
      menuData,
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

.sidebar-header {
  height: 40px;
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
  height: 40px;
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
  height: 40px;
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