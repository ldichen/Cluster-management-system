import { createRouter, createWebHistory } from 'vue-router'
import modelInfo from '../views/modelInfo.vue'
import calInfo from '../views/calInfoPages/calInfo.vue'
import nodeChoose from '../views/nodeChoosePages/nodeChoose.vue'
import proMonitor from '../views/proMonitor.vue'
import tolerantConfig from '../views/tolerantConfig.vue'
import troubleShoot from '../views/troubleShoot.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'modelInfo',
      component: modelInfo
    },
    {
      path: '/cal',
      name: 'cal',
      component: calInfo
    },
    {
      path: '/node',
      name: 'node',
      component: nodeChoose
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: proMonitor
    },
    {
      path: '/config',
      name: 'config',
      component: tolerantConfig
    },
    {
      path: '/shoot',
      name: 'shoot',
      component: troubleShoot
    }

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
