import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import permissionApi from './mockData/permission'
import goodsApi from './mockData/goods'

Mock.mock(/\/api\/home\/getTableData/, 'get', homeApi.getTableData)
Mock.mock(/\/api\/home\/getCountData/, 'get', homeApi.getCountData)
Mock.mock(/\/api\/home\/getChartData/, 'get', homeApi.getChartData)
Mock.mock(/\/api\/record-visit/, 'get', homeApi.recordVisit)

Mock.mock(/\/api\/user\/getUserData(\?.*)?$/, 'get', userApi.getUserList)
Mock.mock(/\/api\/user\/deleteUser(\?.*)?$/, 'get', userApi.deleteUser)
Mock.mock(/\/api\/user\/addUser(\?.*)?$/, 'post', userApi.createUser)
Mock.mock(/\/api\/user\/editUser(\?.*)?$/, 'post', userApi.editUser)

Mock.mock(/\/api\/permission\/getMenu(\?.*)?$/, 'post', permissionApi.getMenu)

Mock.mock(/\/api\/goods\/getGoodsList(\?.*)?$/, 'get', goodsApi.getGoodsList)
Mock.mock(/\/api\/goods\/deleteGoods(\?.*)?$/, 'get', goodsApi.deleteGoods)
Mock.mock(/\/api\/goods\/createGoods(\?.*)?$/, 'post', goodsApi.createGoods)
Mock.mock(/\/api\/goods\/editGoods(\?.*)?$/, 'post', goodsApi.editGoods)
