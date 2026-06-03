import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

let GoodsList = []
const count = 200
// 季节列表
const seasons = ['spring', 'summer', 'autumn', 'winter']

// 模拟200条商品数据
for (let i = 0; i < count; i++) {
  GoodsList.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.ctitle(2, 8),        // 商品名称，2~8个汉字
      price: Mock.Random.float(10, 1000, 0, 2), // 价格 10~1000，保留两位小数
      sex: Mock.Random.integer(0, 2),        // 0:女 1:男 2:通用
      season: seasons[Mock.Random.integer(0, 3)], // 随机季节
      stock: Mock.Random.integer(0, 500),    // 额外加一个库存字段，便于展示
    })
  )
}

export default {
  /**
   * 获取商品列表
   * 参数: name(商品名，可选), page, limit
   */
  getGoodsList: config => {
    const { name, page = 1, limit = 10 } = param2Obj(config.url)

    let mockList = GoodsList.filter(goods => {
      if (name && goods.name.indexOf(name) === -1) return false
      return true
    })

    const pageList = mockList.filter((item, index) =>
      index < limit * page && index >= limit * (page - 1)
    )

    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length,
      }
    }
  },

  /**
   * 删除商品
   * @param id
   */
  deleteGoods: config => {
    const { id } = param2Obj(config.url)

    if (!id) {
      return {
        code: -999,
        data: { msg: '参数不正确' },
        msg: '参数不正确'
      }
    } else {
      GoodsList = GoodsList.filter(g => g.id !== id)
      return {
        code: 200,
        data: { msg: '删除成功' },
        msg: '删除成功'
      }
    }
  },

  /**
   * 增加商品
   * 请求体需包含: name, price, sex, season [, stock]
   */
  createGoods: config => {
    const { name, price, sex, season, stock } = JSON.parse(config.body)
    GoodsList.unshift({
      id: Mock.Random.guid(),
      name: name,
      price: parseFloat(price),
      sex: parseInt(sex),
      season: season,
      stock: stock ? parseInt(stock) : Mock.Random.integer(0, 500),
    })
    return {
      code: 200,
      data: { msg: '添加成功' }
    }
  },

  /**
   * 修改商品
   * 请求体需包含: id, name, price, sex, season [, stock]
   */
  editGoods: config => {
    const { id, name, price, sex, season, stock } = JSON.parse(config.body)

    GoodsList.some(g => {
      if (g.id === id) {
        g.name = name
        g.price = parseFloat(price)
        g.sex = parseInt(sex)
        g.season = season
        if (stock !== undefined) g.stock = parseInt(stock)
        return true
      }
    })
    return {
      code: 200,
      data: { msg: '编辑成功' },
      msg: '编辑成功'
    }
  }
}