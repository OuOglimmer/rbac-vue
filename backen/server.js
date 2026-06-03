const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// 允许前端跨域请求（开发环境）
app.use(cors());
app.use(express.json());

// 初始化数据库
const db = new sqlite3.Database('visits.db');
db.run(`
  CREATE TABLE IF NOT EXISTS unique_ips (
    ip TEXT PRIMARY KEY
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS visit_counter (
    id INTEGER PRIMARY KEY,
    count INTEGER
  )
`);
// 初始化计数器（如果没有记录）
db.get(`SELECT count FROM visit_counter WHERE id = 1`, (err, row) => {
  if (!row) {
    db.run(`INSERT INTO visit_counter (id, count) VALUES (1, 0)`);
  }
});

// API：记录访问并返回最新计数
app.get('/api/record-visit', (req, res) => {
  // 获取真实 IP（考虑代理，开发环境直接取 remoteAddress）
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip.includes(',')) ip = ip.split(',')[0].trim();
  // 去掉 IPv6 前缀 ::ffff:
  ip = ip.replace(/^::ffff:/, '');

  // 检查 IP 是否已存在
  db.get(`SELECT ip FROM unique_ips WHERE ip = ?`, [ip], (err, row) => {
    if (!row) {
      // 新 IP：插入并增加总计数
      db.run(`INSERT INTO unique_ips (ip) VALUES (?)`, [ip]);
      db.run(`UPDATE visit_counter SET count = count + 1 WHERE id = 1`, function(err) {
        db.get(`SELECT count FROM visit_counter WHERE id = 1`, (err, row) => {
          res.json({ count: row.count });
        });
      });
    } else {
      // 老 IP：只返回当前计数
      db.get(`SELECT count FROM visit_counter WHERE id = 1`, (err, row) => {
        res.json({ count: row.count });
      });
    }
  });
});

// API：获取首页表格数据
app.get('/api/home/getTableData', (req, res) => {
  res.json({
    code: 200,
    data: {
      tableData: [
        { name: "oppo", todayBuy: 500, monthBuy: 3500, totalBuy: 22000 },
        { name: "vivo", todayBuy: 300, monthBuy: 2200, totalBuy: 24000 },
        { name: "苹果", todayBuy: 800, monthBuy: 4500, totalBuy: 65000 },
        { name: "小米", todayBuy: 1200, monthBuy: 6500, totalBuy: 45000 },
        { name: "三星", todayBuy: 300, monthBuy: 2000, totalBuy: 34000 },
        { name: "魅族", todayBuy: 350, monthBuy: 3000, totalBuy: 22000 },
      ],
    },
  });
});

app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`);
});