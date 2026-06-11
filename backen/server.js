const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ========== 数据库：访客记录 ==========
const db = new sqlite3.Database('visits.db');
db.run(`CREATE TABLE IF NOT EXISTS unique_ips (ip TEXT PRIMARY KEY)`);
db.run(`CREATE TABLE IF NOT EXISTS visit_counter (id INTEGER PRIMARY KEY, count INTEGER)`);
db.get(`SELECT count FROM visit_counter WHERE id = 1`, (err, row) => {
  if (!row) db.run(`INSERT INTO visit_counter (id, count) VALUES (1, 0)`);
});

// ========== 模拟数据 ==========
const seasons = ['spring', 'summer', 'autumn', 'winter'];
const { Random } = require('mockjs');

const roleOptions = ['admin', 'editor', 'visitor'];
// 用户数据 200 条
let userList = [];
for (let i = 0; i < 200; i++) {
  userList.push({
    id: Random.guid(),
    name: Random.cname(),
    addr: Random.county(true),
    age: Random.integer(18, 60),
    birth: Random.date(),
    sex: Random.integer(0, 1),
    role: roleOptions[Random.integer(0, 2)],
  });
}

// 商品数据 200 条
let goodsList = [];
for (let i = 0; i < 200; i++) {
  goodsList.push({
    id: Random.guid(),
    name: Random.ctitle(2, 8),
    price: parseFloat(Random.float(10, 1000, 2, 2).toFixed(2)),
    sex: Random.integer(0, 2),
    season: seasons[Random.integer(0, 3)],
    stock: Random.integer(0, 500),
  });
}

// ========== 工具：分页过滤器 ==========
function paginate(list, { name, page = 1, limit = 10 }) {
  let filtered = list;
  if (name) filtered = list.filter(item => item.name.includes(name));
  const total = filtered.length;
  const pageList = filtered.slice((page - 1) * limit, page * limit);
  return { list: pageList, count: total };
}

// ========== 权限 / 登录 ==========
app.post('/api/permission/getMenu', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({
      code: 200,
      data: {
        role: 'admin',
        userInfo: { name: 'admin', label: '超级管理员' },
        menuList: [
          { path: '/home', name: 'home', label: '首页', icon: 'house', url: 'Home' },
          { path: '/mall', name: 'mall', label: '商品管理', icon: 'video-play', url: 'Mall' },
          { path: '/goods', name: 'goods', label: '商品列表', icon: 'ShoppingCart', url: 'Goods' },
          { path: '/user', name: 'user', label: '用户管理', icon: 'user', url: 'User' },
          {
            path: 'other', label: '其他', icon: 'location',
            children: [
              { path: '/page1', name: 'page1', label: '页面1', icon: 'setting', url: 'Page1' },
              { path: '/page2', name: 'page2', label: '页面2', icon: 'setting', url: 'Page2' },
            ],
          },
        ],
        token: Random.guid(),
        message: '获取成功',
      },
      msg: '获取成功',
    });
  } else if (username === 'xiaoxiao' && password === 'xiaoxiao') {
    res.json({
      code: 200,
      data: {
        role: 'editor',
        userInfo: { name: 'editor', label: '编辑者' },
        menuList: [
          { path: '/home', name: 'home', label: '首页', icon: 'house', url: 'Home' },
          { path: '/user', name: 'user', label: '用户管理', icon: 'user', url: 'User' },
          { path: '/goods', name: 'goods', label: '商品列表', icon: 'ShoppingCart', url: 'Goods' },
        ],
        token: Random.guid(),
        message: '获取成功',
      },
      msg: '获取成功',
    });
  } else {
    res.json({ code: -999, data: { message: '密码错误' }, msg: '密码错误' });
  }
});

// ========== 首页接口 ==========
app.get('/api/home/getTableData', (req, res) => {
  res.json({
    code: 200,
    data: {
      tableData: [
        { name: 'oppo', todayBuy: 500, monthBuy: 3500, totalBuy: 22000 },
        { name: 'vivo', todayBuy: 300, monthBuy: 2200, totalBuy: 24000 },
        { name: '苹果', todayBuy: 800, monthBuy: 4500, totalBuy: 65000 },
        { name: '小米', todayBuy: 1200, monthBuy: 6500, totalBuy: 45000 },
        { name: '三星', todayBuy: 300, monthBuy: 2000, totalBuy: 34000 },
        { name: '魅族', todayBuy: 350, monthBuy: 3000, totalBuy: 22000 },
      ],
    },
  });
});

app.get('/api/home/getCountData', (req, res) => {
  res.json({
    code: 200,
    data: [
      { name: '今日支付订单', value: 1234, icon: 'SuccessFilled', color: '#2ec7c9' },
      { name: '今日收藏订单', value: 210, icon: 'StarFilled', color: '#ffb980' },
      { name: '今日未支付订单', value: 1234, icon: 'GoodsFilled', color: '#5ab1ef' },
      { name: '本月支付订单', value: 1234, icon: 'SuccessFilled', color: '#2ec7c9' },
      { name: '本月收藏订单', value: 210, icon: 'StarFilled', color: '#ffb980' },
      { name: '本月未支付订单', value: 1234, icon: 'GoodsFilled', color: '#5ab1ef' },
    ],
  });
});

app.get('/api/home/getChartData', (req, res) => {
  res.json({
    code: 200,
    data: {
      orderData: {
        date: ['2019-10-01', '2019-10-02', '2019-10-03', '2019-10-04', '2019-10-05', '2019-10-06', '2019-10-07'],
        data: [
          { 苹果: 3839, 小米: 1423, 华为: 4965, oppo: 3334, vivo: 2820, 一加: 4751 },
          { 苹果: 3560, 小米: 2099, 华为: 3192, oppo: 4210, vivo: 1283, 一加: 1613 },
          { 苹果: 1864, 小米: 4598, 华为: 4202, oppo: 4377, vivo: 4123, 一加: 4750 },
          { 苹果: 2634, 小米: 1458, 华为: 4155, oppo: 2847, vivo: 2551, 一加: 1733 },
          { 苹果: 3622, 小米: 3990, 华为: 2860, oppo: 3870, vivo: 1852, 一加: 1712 },
          { 苹果: 2004, 小米: 1864, 华为: 1395, oppo: 1315, vivo: 4051, 一加: 2293 },
          { 苹果: 3797, 小米: 3936, 华为: 3642, oppo: 4408, vivo: 3374, 一加: 3874 },
        ],
      },
      videoData: [
        { name: '小米', value: 2999 }, { name: '苹果', value: 5999 },
        { name: 'vivo', value: 1500 }, { name: 'oppo', value: 1999 },
        { name: '魅族', value: 2200 }, { name: '三星', value: 4500 },
      ],
      userData: [
        { date: '周一', new: 5, active: 200 }, { date: '周二', new: 10, active: 500 },
        { date: '周三', new: 12, active: 550 }, { date: '周四', new: 60, active: 800 },
        { date: '周五', new: 65, active: 550 }, { date: '周六', new: 53, active: 770 },
        { date: '周日', new: 33, active: 170 },
      ],
    },
  });
});

// ========== 访客记录 ==========
app.get('/api/record-visit', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip.includes(',')) ip = ip.split(',')[0].trim();
  ip = ip.replace(/^::ffff:/, '');
  db.get(`SELECT ip FROM unique_ips WHERE ip = ?`, [ip], (err, row) => {
    if (!row) {
      db.run(`INSERT INTO unique_ips (ip) VALUES (?)`, [ip]);
      db.run(`UPDATE visit_counter SET count = count + 1 WHERE id = 1`, function () {
        db.get(`SELECT count FROM visit_counter WHERE id = 1`, (err, row2) => {
          res.json({ code: 200, data: { count: row2.count } });
        });
      });
    } else {
      db.get(`SELECT count FROM visit_counter WHERE id = 1`, (err, row2) => {
        res.json({ code: 200, data: { count: row2.count } });
      });
    }
  });
});

// ========== 用户 CRUD ==========
app.get('/api/user/getUserData', (req, res) => {
  const result = paginate(userList, req.query);
  res.json({ code: 200, data: result });
});

app.get('/api/user/deleteUser', (req, res) => {
  const { id } = req.query;
  if (!id) return res.json({ code: -999, data: { msg: '参数不正确' }, msg: '参数不正确' });
  userList = userList.filter(u => u.id !== id);
  res.json({ code: 200, data: { msg: '删除成功' }, msg: '删除成功' });
});

app.post('/api/user/addUser', (req, res) => {
  const { name, addr, age, birth, sex, role } = req.body;
  userList.unshift({ id: Random.guid(), name, addr, age, birth, sex: parseInt(sex), role: role || 'visitor' });
  res.json({ code: 200, data: { msg: '添加成功' } });
});

app.post('/api/user/editUser', (req, res) => {
  const { id, name, addr, age, birth, sex, role } = req.body;
  const idx = userList.findIndex(u => u.id === id);
  if (idx > -1) userList[idx] = { id, name, addr, age, birth, sex: parseInt(sex), role: role || userList[idx].role };
  res.json({ code: 200, data: { msg: '编辑成功' }, msg: '编辑成功' });
});

// ========== 商品 CRUD ==========
app.get('/api/goods/getGoodsList', (req, res) => {
  const result = paginate(goodsList, req.query);
  res.json({ code: 200, data: result });
});

app.get('/api/goods/deleteGoods', (req, res) => {
  const { id } = req.query;
  if (!id) return res.json({ code: -999, data: { msg: '参数不正确' }, msg: '参数不正确' });
  goodsList = goodsList.filter(g => g.id !== id);
  res.json({ code: 200, data: { msg: '删除成功' }, msg: '删除成功' });
});

app.post('/api/goods/createGoods', (req, res) => {
  const { name, price, sex, season, stock } = req.body;
  goodsList.unshift({
    id: Random.guid(), name, price: parseFloat(price),
    sex: parseInt(sex), season,
    stock: stock ? parseInt(stock) : Random.integer(0, 500),
  });
  res.json({ code: 200, data: { msg: '添加成功' } });
});

app.post('/api/goods/editGoods', (req, res) => {
  const { id, name, price, sex, season, stock } = req.body;
  const idx = goodsList.findIndex(g => g.id === id);
  if (idx > -1) {
    goodsList[idx] = {
      id, name, price: parseFloat(price), sex: parseInt(sex), season,
      stock: stock !== undefined ? parseInt(stock) : goodsList[idx].stock,
    };
  }
  res.json({ code: 200, data: { msg: '编辑成功' }, msg: '编辑成功' });
});

// ========== 启动 ==========
app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`);
});
