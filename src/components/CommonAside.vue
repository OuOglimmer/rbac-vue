<template>
  <el-aside :width="isCollapse ? '60px' : '180px'">
     <el-menu 
     background-color="#545c64" 
     text-color="#fff"
     :collapse="isCollapse"
     >
     <h3 v-show="!isCollapse">通用后台管理系统</h3>
     <h3 v-show="isCollapse">后台</h3>
       <el-menu-item
            v-for="item in noChildren"
            :key="item.path"
            :index="item.path"
        >
        <component class="icons" :is="item.icon">  </component>        
        <span>{{item.label}}</span>
        </el-menu-item>

        <el-sub-menu 
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
        >
          <template #title>
           <component class="icons" :is="item.icon">  </component>        
           <span>{{item.label}}</span>
          </template>
          <!-- item是指向现在正在调用的hasChildren中的对象，subItem是指向item.children中的对象，subIndex是指向item.children中的索引 -->
          <el-menu-item-group>
            <el-menu-item
              v-for="(subItem,subIndex) in item.children"
              :key="subItem.path"
              :index="subItem.path"
            >
           <component class="icons" :is="subItem.icon"></component>        
           <span>{{subItem.label}}</span>
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

h3{
 text-align: center;
}


.el-menu{
  border-right: none;
  h3{
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}

.el-aside{
  height: 100%;
  background-color: #545c64;
}

.icons{
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
</style>
