<script setup>
    import { ref, onMounted ,reactive} from 'vue'
    import api from '@/api/api'
    import * as echarts from 'echarts'
import { dataType } from 'element-plus/es/components/table-v2/src/common.mjs'

    const time = new Date()
    const lastLoginTime = ref('')
    const count = ref(0)
    const tableData = ref([])
    const tableLabel = ref({
        name: "课程",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
    })
  // 添加这一行（变量名必须与模板中的 ref 属性值一致）
  const echart = ref(null)
  const echart2 = ref(null)
  const echart3 = ref(null)



  //这个是折线图和柱状图 两个图表共用的公共配置
    // echarts 配置对象
    const xOptions = reactive({
          // 图例文字颜色
          textStyle: {
            color: "#333",
          },
          legend: {},
          grid: {
            left: "20%",
          },
          // 提示框
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category", // 类目轴
            data: [],
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
            axisLabel: {
              interval: 0,
              color: "#333",
            },
          },
          yAxis: [
            {
              type: "value",
              axisLine: {
                lineStyle: {
                  color: "#17b3a3",
                },
              },
            },
          ],
          color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
          series: [],
    })

    const pieOptions = reactive({
      tooltip: {
        trigger: "item",
      },
      legend: {},
      color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf",
      ],
      series: []
    })

    const countData = ref([])
    const chartData = ref([])



    const getImageUrl = (user) => {
      return new URL(`../assets/images/${user}.png`, import.meta.url).href
    }

    const getTableData = async () => {
      const data = await api.getTableData()
      tableData.value = data.tableData
    }

    const getCountData = async () => {
      const data = await api.getCountData()
      countData.value = data
    }
    const getChartData = async () => {
      const {orderData,userData,videoData} = await api.getChartData()
      //对于第一个图像对于x轴,进行series赋值
      xOptions.xAxis.data=orderData.date
      xOptions.series = Object.keys(orderData.data[0]).map(val=>({
        name:val,
        data:orderData.data.map(item=>item[val]),
        type: "line"
      })
      )
      
      const oneEcharts = echarts.init(echart.value)
      oneEcharts.setOption(xOptions)


      //对于第二个图像对于x轴,进行series赋值
      xOptions.xAxis.data = userData.map(item => item.date)
      xOptions.series = [
        {
          name: "新增用户",
          data: userData.map(item => item.new),
          type: 'bar'
        },
        {
          name: "活跃用户",
          data: userData.map(item => item.active),
          type: 'bar'
        }
      ]
        const twoEcharts = echarts.init(echart2.value)
        twoEcharts.setOption(xOptions)

      //对于第三个图像对于x轴,进行series赋值
      pieOptions.series = [
        {
          data: videoData,
          type:'pie'
        } 
      ]
        const threeEcharts = echarts.init(echart3.value)
        threeEcharts.setOption(pieOptions)
        
        // 监听窗口变化
        // 如果监听的容器大小发生变化,改变之后，会执行回调函数
        ResizeObserver.value = new ResizeObserver((entries) => {
          oneEcharts.resize()
          twoEcharts.resize()
          threeEcharts.resize()
        })

        // 容器存在
        if (echart.value) {
          ResizeObserver.value.observe(echart.value)
        }
                
        }  

    onMounted(async () => {
      await getTableData()
      await getCountData()
      await getChartData()
      try {
        const data = await api.recordVisit()
        count.value = data.count
      } catch (err) {
        console.error('获取访问次数失败', err)
      }

      const savedTime = localStorage.getItem('lastLoginTime')
      if (savedTime) lastLoginTime.value = savedTime
      const now = new Date().toLocaleString()
      localStorage.setItem('lastLoginTime', now)
    })
</script>

<template>

  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px;"> 
      <el-card shadow="hover" class="user-table">
        <div class="user">
          <img :src="getImageUrl('user')" alt="用户头像">
          <div class="user-info">
            <p>管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>登录时间：{{ time.toLocaleString() }}</p>
          <p>上一次登录时间：{{ lastLoginTime }}</p>
          <p>被访问的次数：{{ count }}<span>次</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData" :columns="tableLabel" style="width: 100%">
          <el-table-column
          v-for="val,key in tableLabel"
          :key="key"
          :prop="key"
          :label="val"
          >

          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 37px;" shadow="hover">
      <div class="num">
      <el-card
      :body-style="{display: 'flex', padding: 0}"
      v-for="item in countData"
      :key="item.name"
      >
      <component :is="item.icon" class="icons" :style="{backgroundColor: item.color}"/>
      <div class="detail" style="height: 80px;">
        <div class="nums">{{ item.value }}</div>
        <div class="txt">{{ item.name }}</div>
      </div>
      </el-card>
      </div>
      <el-card class="top-echart">
        <div ref="echart" style="height: 280px;" ></div>
      </el-card>  
      
      <div class="graph" style="height: 320px;">
        <el-card style="height: 320px;">
          <div ref="echart2" style="height: 280px;"></div>
        </el-card>
        <el-card style="height: 320px;">
          <div ref="echart3" style="height: 280px;"></div>
        </el-card>
      </div>  
          
    </el-col>
  </el-row>

</template>

<style scoped lang="less">
  .home{
    height: 100%;
    overflow: hidden;
    .user{
      display: flex;
      align-items: center;   
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      img{
        width: 150px;
        height: 150px;
        border-radius: 10px;
        margin-right: 20px;
      }
    }
    .login-info{
      margin-top: 20px;
      font-size: 14px;
      color: #666;
      span{
       color: #666;
       margin-left: 10px;
      }
    }
    .user-table{
      margin-top: 20px;
    }
  }
  .num{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card{
     width: 32%;
     margin-bottom: 20px;
    }
    .icons{
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
    }
  }
  .nums{
    font-size: 25px;
    font-weight: bold;
    text-align: center;
  }
  .txt{
    font-size: 30px;
    color: #666;
    transform: translateX(5px);
  }
    .graph{
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .el-card{
        width: 48%;
        height: 260px;
      }
    }
</style>
