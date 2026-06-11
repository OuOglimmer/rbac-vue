<script setup>
import {ref,getCurrentInstance,onMounted,reactive,nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import config from '../config'
const handleClick = () => {
  console.log('click')
}

const tableData = ref([])

const {proxy} = getCurrentInstance()

const getUserData = async () => {
  try {
    const data = await proxy.$api.getUserData(userConfig)
    const roleLabels = { admin: '超级管理员', editor: '编辑者', visitor: '访客' }
    tableData.value = data.list.map(item => ({
      ...item,
      sexLabel: item.sex ===1 ? '男' : '女',
      roleLabel: roleLabels[item.role] || item.role,
    }))
    userConfig.total = data.count
  } catch (error) {
    console.log(error)
  }
}
const roleLabels = { admin: '超级管理员', editor: '编辑者', visitor: '访客' }

const tableLabel = reactive([
  {
    prop:'name',
    label:'姓名' 
  },
   {
    prop:'age',
    label:'年龄' 
  },
   {
    prop:'sexLabel',
    label:'性别' 
  },
   {
    prop:'roleLabel',
    label:'角色',
  },
   {
    prop:'birth',
    label:'出生日期' ,
    width:200,
  },
   {
    prop:'addr',
    label:'地址' ,
    width:500,
  },
   
  
])

const formInline = reactive({
  keyword: '',
})

const userConfig = reactive({
  name:'',
  total:0,
  page:1
})
const handleSearch = () => {
  userConfig.name = formInline.keyword
  getUserData()
}

const handleChange = (page) => {
  userConfig.page = page
  getUserData()
}


const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await proxy.$api.deleteUser({ id: row.id })

        ElMessage({
          message: '删除成功',
          type: 'success',
          showClose: true,
        })

        getUserData()
      } catch (error) {
        console.log(error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      console.log('取消删除')
    })
}
const action = ref('add')
const dialogVisible = ref(false)
const formUser = reactive({
  name:'',
  age:'',
  sex:null,
  birth:'',
  addr:'',
  role:'',
})
// 表单的验证规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: false, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})

const handleClose = () => {
  // 获取表单,重置表单
  dialogVisible.value = false
}

const handleCancel = () => {
  // 取消添加用户操作
  dialogVisible.value = false
}

const handleAdd = () => {
  action.value = 'add'
  dialogVisible.value = true
}
const timeFormat = (time) => {
  var time = new Date(time)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var data = time.getDate()
  function addZero(num) {
    return num < 10 ? '0' + num : num
  }
  return `${year}-${addZero(month)}-${addZero(data)}`
}
const onSubmit = () => {
  // 校验表单
  proxy.$refs['userForm'].validate(async (valid) => {
    if (valid) {
      let res = null
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
      if (action.value === 'add') {
        console.log(formUser);
        res =  await proxy.$api.addUser(formUser)
      } else{
        res = await proxy.$api.editUser({ ...formUser })
      }
      if(res){
        dialogVisible.value = false
        proxy.$refs['userForm'].resetFields()
       handleClose()
       getUserData()
      }
      else {
        ElMessage.error({
          showClose: true,
          message: '添加失败，请输入正确的内容',
        })
        // await proxy.$api.updateUser({ ...formUser })
      }
      
    }
  })
}
const handleEdit = (row) => {
  action.value = 'edit'
  dialogVisible.value = true
  nextTick(() => {
    Object.assign(formUser, {...row})
  })
}
 onMounted(async () => {
   getUserData()
 })

</script>

<template>
  <div class="user-header">
    <!-- 按钮 -->
    <el-button type="primary" @click="handleAdd">添加用户</el-button>
    <!-- 表单 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input  placeholder="请输入用户名" v-model="formInline.keyword" ></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
      <!-- 表格 -->

  <div class="table">
       <el-table :data="tableData" style="width: 100%">
          <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : '125'"
           />

          <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default="scope">
              <el-button  type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button  type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination  
            class="pager"
            background 
            layout="prev, pager, next" 
            size="small"
            :total="userConfig.total" 
            @current-change="handleChange"
        />
      </div>
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
       <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
      <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  class="select-clearn"  label="性别" prop="sex">
              <el-select  v-model="formUser.sex" placeholder="请选择"  style="width: 100%"> 
                <el-option label="男" :value="1" />
                <el-option label="女" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请输入"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="select-clearn" label="角色" prop="role">
              <el-select v-model="formUser.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="超级管理员" value="admin" />
                <el-option label="编辑者" value="editor" />
                <el-option label="访客" value="visitor" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="地址"
              prop="addr"
            >
              <el-input v-model="formUser.addr" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
  </el-dialog>
</template>

<style scoped lang="less">
.user-header {
  margin-top: 20px;
  display: flex;
  // 垂直居中对齐
  align-items: center;
  justify-content: space-between;
  align-items: center;
} 
.table{
  position: relative;
  height: 520px;
  .pager{
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  .el-table{
    width: 100%;
    height: 530px;
  }
}
.select-clearn{
  display: flex;
}

</style>
