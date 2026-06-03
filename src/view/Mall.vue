<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)

const query = reactive({
  name: '',
  page: 1,
  limit: 10,
  total: 0
})

const getGoodsList = async () => {
  loading.value = true
  try {
    const res = await proxy.$api.getGoodsList(query)
    tableData.value = res.list
    query.total = res.count
  } catch {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.page = 1
  getGoodsList()
}

const handleChange = (page) => {
  query.page = page
  getGoodsList()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await proxy.$api.deleteGoods({ id: row.id })
      ElMessage({ type: 'success', message: '删除成功', showClose: true })
      getGoodsList()
    } catch {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const action = ref('add')
const dialogVisible = ref(false)
const formGoods = reactive({
  name: '',
  price: '',
  sex: null,
  season: '',
  stock: ''
})

const rules = reactive({
  name: [{ required: true, message: '商品名称是必填项', trigger: 'blur' }],
  price: [{ required: true, message: '价格是必填项', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  season: [{ required: true, message: '请选择季节', trigger: 'change' }]
})

const seasonOptions = [
  { label: '春季', value: 'spring' },
  { label: '夏季', value: 'summer' },
  { label: '秋季', value: 'autumn' },
  { label: '冬季', value: 'winter' }
]

const sexOptions = [
  { label: '女', value: 0 },
  { label: '男', value: 1 },
  { label: '通用', value: 2 }
]

const seasonLabel = (s) => seasonOptions.find(o => o.value === s)?.label || s
const sexLabel = (s) => sexOptions.find(o => o.value === s)?.label || ''

const handleClose = () => {
  dialogVisible.value = false
}

const handleCancel = () => {
  dialogVisible.value = false
}

const handleAdd = () => {
  action.value = 'add'
  Object.assign(formGoods, { name: '', price: '', sex: null, season: '', stock: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  action.value = 'edit'
  dialogVisible.value = true
  nextTick(() => {
    Object.assign(formGoods, { ...row })
  })
}

const onSubmit = () => {
  proxy.$refs['goodsForm'].validate(async (valid) => {
    if (!valid) return
    try {
      if (action.value === 'add') {
        await proxy.$api.addGoods({ ...formGoods })
      } else {
        await proxy.$api.editGoods({ ...formGoods })
      }
      dialogVisible.value = false
      proxy.$refs['goodsForm'].resetFields()
      getGoodsList()
    } catch {
      ElMessage.error('操作失败')
    }
  })
}

onMounted(() => getGoodsList())
</script>

<template>
  <div class="mall-page">
    <div class="mall-header">
      <el-button type="primary" @click="handleAdd">添加商品</el-button>
      <el-form :inline="true" :model="query">
        <el-form-item label="商品名称">
          <el-input v-model="query.name" placeholder="请输入商品名称" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-wrap">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" width="120" />
        <el-table-column label="季节" width="100">
          <template #default="{ row }">{{ seasonLabel(row.season) }}</template>
        </el-table-column>
        <el-table-column label="性别" width="100">
          <template #default="{ row }">{{ sexLabel(row.sex) }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column fixed="right" label="操作" min-width="140">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="prev, pager, next"
        size="small"
        :total="query.total"
        @current-change="handleChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="action === 'add' ? '添加商品' : '编辑商品'"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="formGoods" :rules="rules" ref="goodsForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formGoods.name" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input v-model="formGoods.price" placeholder="请输入价格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="季节" prop="season">
              <el-select v-model="formGoods.season" placeholder="请选择" style="width: 100%">
                <el-option v-for="o in seasonOptions" :key="o.value" :label="o.label" :value="o.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="formGoods.sex" placeholder="请选择" style="width: 100%">
                <el-option v-for="o in sexOptions" :key="o.value" :label="o.label" :value="o.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="formGoods.stock" placeholder="请输入库存" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.mall-page {
  padding: 20px;
}
.mall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.table-wrap {
  position: relative;
  .pager {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
