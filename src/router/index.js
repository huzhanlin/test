import Vue from 'vue'
import VueRouter from 'vue-router'
import near from '@/views/near/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: near
  },
  {
    path: '/near',
    name: 'near',
    component: near
  },
  {
    path: '/shapping/:id',
    name: 'shapping_id',
    component: () => import('@/views/shapping/index.vue'),
    props: true
  },
  {
    path: '/hot',
    name: 'hot',
    component: () => import('@/views/hot/index.vue')
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('@/views/activity/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router


// component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')