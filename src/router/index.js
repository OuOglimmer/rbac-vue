import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
  {
    path:'/',
    name:'main',
    component:()=>import('@/view/Main.vue'),
    redirect:'/home',
    children:[
      {
        path:'home',
        name:'home',
        component:()=>import('@/view/Home.vue')
      }
    ],
  },
]

const router = createRouter({
  history:createWebHashHistory(),
  routes:routes
})

export default router