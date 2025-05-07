// src/main.js

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'


import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // Import styles
import * as ElementPlusIconsVue from '@element-plus/icons-vue'







const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus); // Register all components globally

app.use(router)
app.use(store)
app.mount('#app')

