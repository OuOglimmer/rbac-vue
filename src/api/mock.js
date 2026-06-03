import Mock from 'mockjs'
import homeApi from './mockData/home'

// 1.拦截的路径  2.拦截的方法  3.制造的假数据
Mock.mock(/\/api\/home\/getTableData/, 'get', homeApi.getTableData)
Mock.mock(/\/api\/home\/getCountData/, 'get', homeApi.getCountData)
Mock.mock(/\/api\/home\/getChartData/, 'get', homeApi.getChartData)
Mock.mock(/\/api\/record-visit/, 'get', homeApi.recordVisit)
