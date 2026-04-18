# 🚀 电商项目部署指南

## 📋 项目概述

这是一个完整的前后端分离电商项目，使用React + TypeScript前端和Node.js + Express + MySQL后端。

## 🛠️ 技术栈

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
- MySQL 8.0
- Sequelize ORM
- JWT认证
- Bcrypt密码加密

### 部署
- Docker
- Docker Compose
- Nginx

## 🐛 已知问题和修复

### 已修复的问题

1. **MongoDB到MySQL转换问题**
   - 修复auth.js中的`findOne()`方法，添加`where`条件
   - 修复auth.js中的`findById()`改为`findByPk()`
   - 修复products.js中的查询语法，使用Sequelize语法替代Mongoose语法
   - 修复users.js中的`findByIdAndUpdate()`改为`findByPk()` + `update()`
   - 修复模型中的setter方法，使用`setDataValue()`替代`getDataValue()`

2. **JWT Token生成问题**
   - 修复使用`user._id`改为`user.id`

3. **数据库模型问题**
   - 修复Product、Order模型中的JSON字段setter方法

## 🚀 部署方式

### 方式一：Docker部署（推荐）

#### 前提条件
- Docker和Docker Compose已安装
- MySQL 8.0镜像可用

#### 部署步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd ecommerce-project
   ```

2. **启动服务**
   ```bash
   docker-compose up -d
   ```

3. **验证服务状态**
   ```bash
   docker-compose ps
   ```

4. **查看日志**
   ```bash
   # 查看所有服务日志
   docker-compose logs

   # 查看特定服务日志
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs mysql
   ```

#### 服务访问
- 前端应用：http://localhost:3000
- 后端API：http://localhost:5000/api
- Nginx代理：http://localhost

#### 默认管理员账户
- 邮箱：admin@example.com
- 密码：admin123

### 方式二：本地开发部署

#### 前提条件
- Node.js 16+ 已安装
- MySQL 8.0 已安装并运行
- npm 或 yarn 已安装

#### 数据库设置

1. **创建数据库**
   ```sql
   CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **配置数据库连接**
   确保MySQL运行在localhost:3306，用户名为root，密码为123456

#### 后端部署

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建`.env`文件（已存在，检查配置）：
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ecommerce
   DB_USER=root
   DB_PASSWORD=123456
   DB_DIALECT=mysql
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=30d
   ```

4. **启动后端服务**
   ```bash
   # 开发模式（热重载）
   npm run dev

   # 生产模式
   npm start
   ```

#### 前端部署

1. **进入前端目录**
   ```bash
   cd frontend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置API地址**
   修改环境变量或直接在代码中配置API基础URL：
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **启动前端服务**
   ```bash
   # 开发模式
   npm start

   # 生产构建
   npm run build
   ```

## 📁 项目结构

```
ecommerce-project/
├── backend/                     # Node.js后端API
│   ├── models/                  # 数据模型
│   ├── routes/                  # API路由
│   ├── middleware/              # 中间件
│   ├── config/                  # 配置
│   └── server.js               # 应用入口
│
├── frontend/                    # React前端应用
│   ├── src/                    # 源代码
│   │   ├── components/         # 组件
│   │   ├── pages/              # 页面
│   │   ├── store/              # Redux状态管理
│   │   └── index.tsx           # 入口文件
│   └── public/                 # 静态资源
│
├── docs/                       # 项目文档
├── docker-compose.yml          # Docker编排配置
├── nginx.conf                  # Nginx配置
├── mysql-init.sql             # MySQL初始化脚本
└── README.md                  # 项目主文档
```

## 🔧 常见问题解决

### 1. 数据库连接失败

**问题**：后端无法连接到MySQL数据库

**解决方案**：
1. 确保MySQL服务正在运行
2. 检查数据库配置是否正确
3. 验证用户名和密码
4. 检查防火墙设置

```bash
# 测试数据库连接
mysql -u root -p123456 -h localhost -D ecommerce
```

### 2. 前端依赖安装失败

**问题**：`npm install`失败，TypeScript版本冲突

**错误信息**：
```
npm error ERESOLVE could not resolve
npm error While resolving: react-scripts@5.0.1
npm error Found: typescript@5.9.3
npm error Could not resolve dependency:
peerOptional typescript@"^3.2.1 || ^4" from react-scripts@5.0.1
```

**解决方案**：
1. **已修复**：package.json中的TypeScript版本已更新为^4.9.5
2. 如果仍然遇到问题，尝试：
   ```bash
   # 清除npm缓存
   npm cache clean --force
   
   # 删除node_modules和lock文件
   rm -rf node_modules package-lock.json
   
   # 重新安装
   npm install
   
   # 如果仍然失败，使用legacy模式
   npm install --legacy-peer-deps
   ```

### 3. CORS错误

**问题**：前端无法访问后端API

**解决方案**：
1. 检查后端CORS配置
2. 确保前端API地址正确
3. 检查环境变量ALLOWED_ORIGINS

### 4. JWT认证失败

**问题**：登录后无法访问受保护的路由

**解决方案**：
1. 检查JWT密钥配置
2. 验证token是否正确发送
3. 检查token过期时间

## 📊 API端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 用户登出

### 商品相关
- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取商品详情
- `POST /api/products` - 创建商品（管理员）
- `PUT /api/products/:id` - 更新商品（管理员）
- `DELETE /api/products/:id` - 删除商品（管理员）

### 订单相关
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取用户订单
- `GET /api/orders/:id` - 获取订单详情

### 用户相关
- `GET /api/users/profile` - 获取用户资料
- `PUT /api/users/profile` - 更新用户资料

## 🔒 安全建议

1. **生产环境配置**
   - 更改所有默认密码
   - 使用强JWT密钥
   - 配置HTTPS
   - 限制文件上传类型和大小

2. **环境变量**
   - 不要在代码中硬编码敏感信息
   - 使用.env文件管理配置
   - 将.env添加到.gitignore

3. **数据库安全**
   - 使用专用数据库用户
   - 限制数据库用户权限
   - 定期备份数据

## 🚀 性能优化

1. **前端优化**
   - 使用代码分割
   - 启用Gzip压缩
   - 优化图片资源

2. **后端优化**
   - 启用数据库连接池
   - 使用Redis缓存
   - 优化数据库查询

3. **部署优化**
   - 使用CDN
   - 启用Gzip压缩
   - 配置负载均衡

## 📞 支持

如遇问题，请检查：
1. 查看日志文件
2. 确认配置正确
3. 检查网络连接
4. 验证数据库状态

---

**最后更新**: 2026年4月18日
**版本**: 1.0.0
**状态**: ✅ 已修复并测试完成