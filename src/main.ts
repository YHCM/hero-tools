import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import route from './router'
import './style.css'
import App from './App.vue'

import { useSavesStore } from './stores/savesStore'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)

// 初始化存档
const saveStore = useSavesStore()
saveStore.initDefaults()

app.use(route)
app.mount('#app')
