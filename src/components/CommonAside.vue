<template>
  <el-aside :class="['custom-aside', { collapsed: isCollapse }]">
     <!-- 关键：移除 :collapse 属性，手动控制宽度 -->
     <el-menu 
     background-color="#545c64" 
     text-color="#fff"
     >
     <h3 v-show="!isCollapse">通用后台管理系统</h3>
     <h3 v-show="isCollapse">后台</h3>
       
       <el-menu-item
            v-for="item in noChildren"
            :key="item.path"
            :index="item.path"
        >
        <component class="icons" :is="item.icon"></component>        
        <span class="menu-text" :class="{ hide: isCollapse }">{{item.label}}</span>
        </el-menu-item>

        <el-sub-menu 
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
        >
          <template #title>
           <component class="icons" :is="item.icon"></component>        
           <span class="menu-text" :class="{ hide: isCollapse }">{{item.label}}</span>
          </template>
          
          <el-menu-item-group>
            <el-menu-item
              v-for="(subItem,subIndex) in item.children"
              :key="subItem.path"
              :index="subItem.path"
            >
           <component class="icons" :is="subItem.icon"></component>        
           <span class="menu-text" :class="{ hide: isCollapse }">{{subItem.label}}</span>
           </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
       
      </el-menu>
  </el-aside>
</template>

<script setup>
import { ref,computed } from 'vue'
import { useCounterStore } from '@/stores/index'
// 来自stores/index.js中的isCollapse 表示当前的菜单是否折叠起来
const store = useCounterStore()
const isCollapse = computed(() => store.isCollapse)

const list =ref([
      	{
          path: '/home',
          name: 'home',
          label: '首页',
          icon: 'house',
          url: 'Home'
      	},
        {
            path: '/mall',
            name: 'mall',
            label: '商品管理',
            icon: 'video-play',
            url: 'Mall'
        },
        {
            path: '/user',
            name: 'user',
            label: '用户管理',
            icon: 'user',
            url: 'User'
        },
        {
            path: 'other',
            label: '其他',
            icon: 'location',
            children: [
                {
                    path: '/page1',
                    name: 'page1',
                    label: '页面1',
                    icon: 'setting',
                    url: 'Page1'
                },
                {
                    path: '/page2',
                    name: 'page2',
                    label: '页面2',
                    icon: 'setting',
                    url: 'Page2'
                }
            ]
        }
])

// 判断一个List对象是否还有子类对象，并且把有子类对象的筛选出来，封装到hasChildren中，反之，封装到noChildren中
const noChildren = computed(() => {
  return list.value.filter(item => !item.children)
})
const hasChildren = computed(() => {
  return list.value.filter(item => item.children)
})
</script>

<style scoped lang="less">
.custom-aside {
  height: 100%;
  background-color: #545c64;
  width: 180px;
  transition: none !important;
  flex-shrink: 0;
  overflow: hidden;
}

/* 关键：折叠时侧边栏变窄 */
.custom-aside.collapsed {
  width: 60px;
}

/* 关键：用 CSS 直接控制文字显示/隐藏，不用 v-show */
.menu-text {
  display: inline-block;
  transition: none !important;
}

.menu-text.hide {
  display: none !important;
  visibility: hidden;
}

.el-menu-item {
  transition: none !important;
}

.el-sub-menu__title {
  transition: none !important;
}

/* el-menu 内部样式覆盖，确保没有过渡 */
.el-menu {
  border-right: none;
  --el-menu-base-level-padding: 20px; /* 可选，调整内边距 */
}

.el-menu--collapse {
  width: 100% !important;  /* 防止 el-menu 自己有宽度限制 */
}

.el-menu-item [class^="el-icon"],
.el-sub-menu__title [class^="el-icon"] {
  transition: none !important;
}

h3 {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  line-height: 48px;
  color: #fff;
  margin: 0;
  transition: none !important;
}

.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}

.el-aside {
  height: 100%;
  background-color: #545c64;
}

.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  flex-shrink: 0;
}

/* 折叠时让菜单项内容居中（图标居中） */
.custom-aside.collapsed .el-menu-item {
  justify-content: center;
  padding: 0 !important;
}

.custom-aside.collapsed .el-sub-menu__title {
  justify-content: center;
  padding: 0 !important;
}

.custom-aside.collapsed .icons {
  margin-right: 0;
}
</style>
