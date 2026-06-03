<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const tags = computed(() => store.state.tags)
const route = useRoute()
const router = useRouter()

const handleMenu = (tag) => {
  router.push(tag.path)
  store.selectMenu(tag)
}

const handleClose = (tag, index) => {
  store.updateTags(tag)
  if (tag.name !== route.name) return
  const tagList = tags.value
  const nextTag = tagList[index] || tagList[index - 1]
  if (nextTag) {
    store.selectMenu(nextTag)
    router.push(nextTag.path)
  }
}
</script>

<style scoped lang="scss">
.tags {
  margin: 20px 0 0 20px;
}
.el-tag {
  margin-right: 10px;
}
</style>
