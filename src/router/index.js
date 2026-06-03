import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/view/Main.vue"),
    redirect: "/home",
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/Login.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/view/404.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
