<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const goodsList = ref([])
const total = ref(0)
const searchName = ref('')
const query = reactive({
  name: '',
  page: 1,
  limit: 12
})
const loading = ref(false)

const getGoodsList = async () => {
  loading.value = true
  try {
    const res = await proxy.$api.getGoodsList(query)
    goodsList.value = res.list
    total.value = res.count
  } catch {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.name = searchName.value
  query.page = 1
  getGoodsList()
}

const handlePrev = () => {
  if (query.page > 1) {
    query.page--
    getGoodsList()
  }
}

const handleNext = () => {
  if (query.page < Math.ceil(total.value / query.limit)) {
    query.page++
    getGoodsList()
  }
}

const imgSrc = (id) => `https://picsum.photos/seed/${id}/300/300`

const seasonLabel = (s) => ({ spring: '春', summer: '夏', autumn: '秋', winter: '冬' }[s] || s)

onMounted(() => getGoodsList())
</script>

<template>
  <div class="goods-page">
    <div class="goods-header">
      <h2>商品列表</h2>
      <div class="search-bar">
        <el-input v-model="searchName" placeholder="搜索商品名称" clearable @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
      </div>
    </div>

    <div v-if="goodsList.length === 0 && !loading" class="empty">暂无商品</div>

    <div v-loading="loading" class="goods-grid">
      <div v-for="item in goodsList" :key="item.id" class="goods-card">
        <div class="goods-img">
          <img :src="imgSrc(item.id)" :alt="item.name" loading="lazy" />
        </div>
        <div class="goods-info">
          <span class="goods-name">{{ item.name }}</span>
          <span class="goods-price">¥{{ item.price }}</span>
          <div class="goods-meta">
            <el-tag size="small">{{ seasonLabel(item.season) }}</el-tag>
            <span class="goods-stock">库存: {{ item.stock }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="total > 0" class="goods-pagination">
      <el-button :disabled="query.page <= 1" @click="handlePrev">上一页</el-button>
      <span class="page-info">第 {{ query.page }} / {{ Math.ceil(total / query.limit) }} 页</span>
      <el-button :disabled="query.page >= Math.ceil(total / query.limit)" @click="handleNext">下一页</el-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.goods-page {
  padding: 20px;
}

.goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }

  .search-bar {
    display: flex;
    gap: 10px;
  }
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-height: 400px;
}

.goods-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: #fff;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
}

.goods-img {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.goods-info {
  padding: 10px 12px 14px;

  .goods-name {
    display: block;
    font-size: 14px;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 6px;
  }

  .goods-price {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #e4393c;
    margin-bottom: 8px;
  }

  .goods-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .goods-stock {
    font-size: 12px;
    color: #909399;
  }
}

.goods-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;

  .page-info {
    font-size: 14px;
    color: #606266;
  }
}

.empty {
  text-align: center;
  padding: 80px 0;
  font-size: 16px;
  color: #909399;
}
</style>
