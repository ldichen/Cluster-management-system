import './assets/main.css'
import Element from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuex from 'vuex'
import axios from 'axios'
import $ from 'jquery'
import locale from 'element-plus/es/locale/lang/en'

locale.el.pagination = {
  goto: '前往',

  pagesize: '条/页',

  total: `共计 {total} 条 `,

  pageClassifier: '页'
}

const app = createApp(App)

app.use(router)
app.use(Element, { locale: locale, size: 'small', zIndex: 3000 })
app.use(vuex)
app.use(axios)
app.use($)

app.mount('#app')
