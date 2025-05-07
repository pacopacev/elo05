import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'  // Ensure this path is correct
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardLayout from '../components/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },

  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '/admin/users',
        name: 'Admin',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Admin Dashboard' }
      },
      {
        path: '/admin/account',
        name: 'AccountSettings',
        component: () => import('../views/LoginView.vue'),
        meta: { title: 'Account Settings' }
      },
      // Add more routes as needed
    ]
  }
//  {
//    path: '/dashboard',
//    name: 'dashboard',
//    component: DashboardView,
//    meta: { requiresAuth: true },
//    children: [
//      {
//        path: '', // Default dashboard child
//        name: 'dashboard1',
//        component: () => import('../views/SimpleContentView.vue')
//      },
//      {
//        path: 'profile', // Becomes /dashboard/profile
//        name: 'profile',
//        component: () => import('../views/SimpleContentView1.vue')
//      },
////      {
////        path: 'settings', // Becomes /dashboard/settings
////        name: 'settings',
////        component: () => import('../views/SettingsView.vue')
////      },
//      // Add more child routes as needed
//    ]
//
//  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
