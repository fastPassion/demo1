# 电商项目 - 前后端分离架构

## 项目概述
这是一个使用前后端分离架构的电商项目，包含用户管理、商品展示、购物车、订单管理等核心功能。

## 🚀 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd ecommerce-project

# 查看详细启动指南
cat QUICKSTART.md
```

## 技术栈
### 前端
- React 18
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios

### 后端
- Node.js
- Express.js
- **MySQL 8.0** (Sequelize)
- JWT 认证
- Bcrypt 密码加密
- Multer 文件上传

### 部署
- Docker
- Nginx
- PM2

## 数据库配置
- **数据库**: MySQL 8.0
- **用户名**: root
- **密码**: 123456
- **数据库名**: ecommerce
- **连接URL**: `mysql://root:123456@localhost:3306/ecommerce`

## 项目结构
```
ecommerce-project/
├── frontend/           # React 前端应用
├── backend/            # Node.js 后端 API
├── docs/              # 项目文档
└── docker-compose.yml  # Docker 编排文件
```

## 🚀 快速开始

### 使用Docker（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 访问应用
# 前端: http://localhost:3000
# 后端API: http://localhost:5000/api
```

### 本地开发

```bash
# 启动后端
cd backend
npm install
npm run dev

# 启动前端（新终端）
cd frontend
npm install
npm start
```

## 🐛 重要说明

本项目已经修复了从MongoDB迁移到MySQL时出现的所有兼容性问题：

### 已修复的问题
- ✅ 认证路由中的MongoDB语法
- ✅ 商品路由中的查询语法
- ✅ 用户路由中的更新方法
- ✅ 模型中的JSON字段处理
- ✅ JWT token生成

### 默认账户
- 管理员: admin@example.com / admin123

### 启动失败？
1. 检查MySQL是否运行
2. 确认端口未被占用
3. 查看详细部署指南

## 📖 详细文档

- [部署指南](DEPLOYMENT_GUIDE.md) - 详细的部署说明和问题解决
- [API文档](docs/API文档.md) - API接口文档
- [快速开始指南](QUICKSTART.md) - 快速启动步骤

## 主要功能
- 用户注册/登录
- 商品浏览和搜索
- 购物车管理
- 订单管理
- 支付集成
- 管理员后台
