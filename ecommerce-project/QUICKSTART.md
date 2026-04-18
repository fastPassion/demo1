# 🚀 电商项目快速开始指南

## 📋 环境要求

- Node.js 18+
- MySQL 8.0+ (用户名: root, 密码: 123456)
- npm 或 yarn

## ⚡ 快速启动

### 方式一：本地开发启动（推荐）

#### 1. 启动MySQL数据库

**Windows:**
```bash
# 确保MySQL服务正在运行
services.msc  # 启动MySQL服务
```

**Linux/Mac:**
```bash
# 启动MySQL服务
sudo systemctl start mysql
# 或
sudo service mysql start
```

**验证MySQL连接：**
```bash
mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS ecommerce;"
```

#### 2. 启动后端服务

```bash
# 打开终端1
cd ecommerce-project/backend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

**预期输出：**
```
服务器运行在端口 5000
环境: development
MySQL连接成功
数据库模型同步完成
```

> 💡 **注意**：如果看到任何MongoDB相关的错误，说明还有遗留的MongoDB语法需要修复。请参考DEPLOYMENT_GUIDE.md中的修复说明。

#### 3. 启动前端应用

```bash
# 打开终端2
cd ecommerce-project/frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

**预期输出：**
```
Compiled successfully!
You can now view ecommerce-frontend in the browser.
Local: http://localhost:3000
```

> 💡 **注意**：TypeScript版本已修复为4.9.5以兼容react-scripts 5.0.1
>
> 如果依赖安装失败，请尝试：
> ```bash
> npm cache clean --force
> rm -rf node_modules package-lock.json
> npm install
> # 如果仍然失败
> npm install --legacy-peer-deps
> ```

### 方式二：Docker一键部署

#### 前提条件
- 安装 Docker 和 Docker Compose

#### 启动命令
```bash
cd ecommerce-project

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🌐 访问应用

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:5000/api
- **健康检查**: http://localhost:5000/health

## 🔑 默认账户

**管理员账户:**
- 邮箱: admin@example.com
- 密码: admin123

## 📊 数据库信息

- **数据库**: ecommerce
- **用户名**: root
- **密码**: 123456
- **主机**: localhost
- **端口**: 3306
- **连接URL**: `mysql://root:123456@localhost:3306/ecommerce`

## 🛠️ 常用命令

### 后端管理
```bash
# 启动开发模式（热重载）
npm run dev

# 启动生产模式
npm start

# 运行测试
npm test
```

### 前端管理
```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test
```

### 数据库管理
```bash
# 连接到数据库
mysql -u root -p123456 ecommerce

# 查看表结构
SHOW TABLES;

# 查看用户表
SELECT * FROM users;

# 查看商品表
SELECT * FROM products;
```

## 🧪 功能测试

### 1. 用户注册测试
- 访问: http://localhost:3000/register
- 填写注册信息
- 验证注册成功

### 2. 用户登录测试
- 访问: http://localhost:3000/login
- 使用管理员账户: admin@example.com / admin123
- 验证登录成功

### 3. 商品浏览测试
- 访问: http://localhost:3000/products
- 查看商品列表
- 点击商品查看详情

### 4. 购物车测试
- 选择商品加入购物车
- 访问购物车页面
- 修改商品数量
- 测试结算功能

### 5. API测试
```bash
# 测试健康检查
curl http://localhost:5000/health

# 测试商品API
curl http://localhost:5000/api/products

# 测试用户注册
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com","password":"password123"}'
```

## 🐛 已知问题和解决方案

### 已修复的MongoDB兼容性问题

本项目已经从MongoDB完全迁移到MySQL，但以下问题可能仍会出现：

1. **认证错误** - 如果看到`findById`或`findOne`错误，请确保使用最新代码
2. **商品查询错误** - 如果商品列表无法加载，检查是否使用了正确的Sequelize语法
3. **用户更新错误** - 用户资料更新失败时，确认已修复`findByIdAndUpdate`方法

### 完整的修复列表请查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🚨 故障排除

### MySQL连接失败
```bash
# 检查MySQL服务状态
sudo systemctl status mysql

# 重启MySQL服务
sudo systemctl restart mysql

# 检查端口占用
netstat -tulpn | grep :3306
```

### 端口冲突
```bash
# 检查端口占用
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# 修改端口
# 前端: 修改 frontend/.env 添加 PORT=3001
# 后端: 修改 backend/.env 修改 PORT=5001
```

### 依赖安装失败
```bash
# 清理缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

## 📚 项目结构

```
ecommerce-project/
├── frontend/           # React前端应用
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── package.json   # 前端依赖
├── backend/           # Node.js后端API
│   ├── models/        # 数据库模型
│   ├── routes/        # API路由
│   ├── middleware/    # 中间件
│   └── server.js      # 入口文件
├── docs/             # 项目文档
├── docker-compose.yml # Docker配置
└── README.md         # 项目说明
```

## 🎯 下一步

1. ✅ 完成项目启动
2. 🔧 根据需求定制功能
3. 📱 开发移动端适配
4. 🚀 部署到生产环境
5. 🔒 配置SSL证书
6. 📈 添加监控和日志

---

**遇到问题？** 请查看 [部署指南](docs/部署指南.md) 或 [API文档](docs/API文档.md) 获取更多信息。