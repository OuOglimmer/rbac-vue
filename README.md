# RBAC-Vue

一个基于 Vue 3 + Vite 的 RBAC（基于角色的访问控制）后台管理系统。角色驱动菜单渲染、动态路由注入、多层路由守卫权限校验，前后端完整实现。

当前仓库把视图层、路由层、状态管理层、Mock 层、后端服务拆成独立模块，核心目标是让**权限策略与视图解耦、路由可动态注入、Mock 可切换、角色可配置**。

## 技术选型

| 技术 | 用途 |
|---|---|
| Vue 3 + Vite | 前端框架与构建工具 |
| Pinia | 状态管理 |
| Vue Router 5 | 路由（Hash 模式 + 动态注入） |
| Element Plus | UI 组件库 |
| Axios | HTTP 请求 |
| Mock.js | 前端 Mock 数据拦截 |
| ECharts | 仪表盘图表 |
| Less | 样式预处理 |
| Express 5 + SQLite | 后端服务与本地持久化 |

## 设计原则

- **Role driven**: 菜单渲染和路由注册完全由角色类型决定
- **Protocol first**: 前后端通过约定 API 契约交互（`/permission/getMenu` 返回角色菜单）
- **Dynamic routing**: 路由不写死在配置中，登录后根据 `menuList` 动态 `addRoute`
- **Guard cascade**: 路由守卫按身份 → 去重 → 恢复 → 存在 → 角色逐层拦截
- **Mock swappable**: 通过 `mock.js` 一键开关 Mock 模式，开发阶段不依赖后端
- **UI and logic separated**: 视图层只通过 Store 和 API 层与业务逻辑交互

当前主链路是：

```
Login 提交凭证
  → /permission/getMenu 获取角色菜单与 token
  → Pinia Store 保存角色、菜单、token
  → addRoute 批量注入动态子路由
  → 路由守卫根据角色 routes 白名单校验页面访问权限
```

## 项目结构

```
rbac-vue/
├── src/               # 前端源码
│   ├── api/           # API 接口 + Mock 拦截 + 请求封装
│   │   ├── mockData/  # Mock 数据（权限、用户、商品、首页）
│   │   ├── api.js     # 接口定义
│   │   ├── mock.js    # Mock 注册
│   │   └── request.js # Axios 封装
│   ├── assets/        # 静态资源
│   ├── components/    # 通用组件（侧边栏、顶栏、标签页）
│   ├── config/        # 环境配置 + 角色定义
│   ├── router/        # 静态路由定义
│   ├── stores/        # Pinia 状态管理
│   ├── utils/         # 工具函数
│   └── view/          # 页面组件
├── backen/            # Express 后端服务
├── dist/              # 构建产物
└── data/              # SQLite 数据文件
```

## 核心模块

- **`src/router/`**: 定义 3 条静态基础路由（main、login、404），动态子路由由 Store 注入
- **`src/stores/`**: `useAllDataStore` 管理菜单、Token、角色、标签页、路由卸载函数，含 localStorage 持久化与刷新恢复
- **`src/api/`**: Axios 实例 + Mock.js 拦截，`/permission/getMenu` 返回 `{ menuList, token, role, userInfo }`
- **`src/components/`**: `CommonAside`（菜单渲染）、`CommonHeader`（登出）、`CommonTab`（标签导航）
- **`src/view/`**: `Login`（登录表单）、`Main`（布局壳）、`Home`（仪表盘）、`User`（用户 CRUD）、`Mall`/`Goods`（商品管理）
- **`src/config/roles.js`**: 角色定义中心，映射角色名 → 可访问路由名数组
- **`backen/server.js`**: Express 服务，提供权限登录、用户 CRUD、商品 CRUD、访客统计接口

## 快速开始

```bash
# 安装前端依赖
bun install

# 启动前端开发服务器（Mock 模式）
bun run dev

# 启动后端服务（可选，关闭 Mock 后使用）
bun run dev:backen

# 构建生产版本
bun run build
```

## 常用脚本

```bash
bun run dev         # 启动 Vite 开发服务器
bun run build       # 构建生产版本
bun run preview     # 预览构建产物
```

## 权限策略

系统预置三个角色，定义在 `src/config/roles.js`：

| 角色 | 可访问路由 | 登录凭证 |
|---|---|---|
| `admin` — 超级管理员 | home, mall, goods, user, page1, page2 | admin / admin |
| `editor` — 编辑者 | home, goods, user | xiaoxiao / xiaoxiao |
| `visitor` — 访客 | home | — |

路由守卫（`src/main.js`）按身份认证 → 重复登录拦截 → 刷新恢复 → 路由存在性 → 角色权限逐层检查，不匹配则跳转 login 或 404。
