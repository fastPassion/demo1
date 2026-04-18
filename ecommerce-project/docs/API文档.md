# API 文档

## 基础信息

- **基础URL**: `http://localhost:5000/api`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **数据库**: MySQL 8.0
- **数据库连接**: `mysql://root:123456@localhost:3306/ecommerce`

## 认证

大部分API需要JWT认证。在请求头中添加：

```
Authorization: Bearer <your-token>
```

## 错误响应格式

```json
{
  "success": false,
  "message": "错误信息",
  "errors": []
}
```

## 用户认证

### 用户注册

**POST** `/auth/register`

**请求体**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "user-id",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": "",
      "role": "user"
    },
    "token": "jwt-token"
  }
}
```

### 用户登录

**POST** `/auth/login`

**请求体**:
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**成功响应**: 同注册响应格式

### 获取当前用户信息

**GET** `/auth/me`

**需要认证**: 是

**成功响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": "",
      "role": "user"
    }
  }
}
```

## 商品管理

### 获取商品列表

**GET** `/products`

**查询参数**:
- `page` (可选): 页码，默认1
- `limit` (可选): 每页数量，默认10，最大100
- `category` (可选): 商品分类
- `minPrice` (可选): 最低价格
- `maxPrice` (可选): 最高价格
- `search` (可选): 搜索关键词
- `sort` (可选): 排序方式 (price_asc, price_desc, rating, newest)

**成功响应**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product-id",
        "name": "智能手机",
        "description": "商品描述",
        "price": 2999,
        "images": ["image-url"],
        "category": "电子产品",
        "stock": 50,
        "rating": 4.5,
        "numReviews": 120
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 获取单个商品

**GET** `/products/:id`

**成功响应**:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product-id",
      "name": "智能手机",
      "description": "商品描述",
      "price": 2999,
      "images": ["image-url"],
      "category": "电子产品",
      "stock": 50,
      "rating": 4.5,
      "numReviews": 120,
      "reviews": [
        {
          "user": {
            "id": "user-id",
            "name": "张三"
          },
          "rating": 5,
          "comment": "很好用",
          "createdAt": "2024-01-15T10:00:00Z"
        }
      ]
    }
  }
}
```

### 创建商品（管理员）

**POST** `/products`

**需要认证**: 是（管理员）

**请求体**:
```json
{
  "name": "新商品",
  "description": "商品描述",
  "price": 999,
  "images": ["image-url"],
  "category": "电子产品",
  "stock": 100,
  "sku": "SKU123456"
}
```

### 更新商品（管理员）

**PUT** `/products/:id`

**需要认证**: 是（管理员）

### 删除商品（管理员）

**DELETE** `/products/:id`

**需要认证**: 是（管理员）

### 添加商品评价

**POST** `/products/:id/reviews`

**需要认证**: 是

**请求体**:
```json
{
  "rating": 5,
  "comment": "商品质量很好，推荐购买"
}
```

## 订单管理

### 创建订单

**POST** `/orders`

**需要认证**: 是

**请求体**:
```json
{
  "orderItems": [
    {
      "product": "product-id",
      "name": "智能手机",
      "image": "image-url",
      "price": 2999,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "北京市朝阳区xxx街道",
    "city": "北京市",
    "postalCode": "100000",
    "country": "中国",
    "phone": "13800138000"
  },
  "paymentMethod": "支付宝",
  "itemsPrice": 2999,
  "shippingPrice": 0,
  "taxPrice": 0,
  "totalPrice": 2999
}
```

### 获取用户订单

**GET** `/orders/myorders`

**需要认证**: 是

### 获取订单详情

**GET** `/orders/:id`

**需要认证**: 是

### 更新订单支付状态

**PUT** `/orders/:id/pay`

**需要认证**: 是

**请求体**:
```json
{
  "paymentResult": {
    "id": "payment-id",
    "status": "success",
    "update_time": "2024-01-15T10:00:00Z",
    "email_address": "payment@example.com"
  }
}
```

## 用户管理

### 获取用户资料

**GET** `/users/profile`

**需要认证**: 是

### 更新用户资料

**PUT** `/users/profile`

**需要认证**: 是

**请求体**:
```json
{
  "name": "新姓名",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

## 购物车

> 注意：购物车功能主要在前端管理，以下API仅供参考

### 获取购物车

**GET** `/cart`

**需要认证**: 是

### 添加商品到购物车

**POST** `/cart`

**需要认证**: 是

**请求体**:
```json
{
  "productId": "product-id",
  "quantity": 2
}
```

## 响应状态码

- `200`: 成功
- `201`: 创建成功
- `400`: 请求错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源未找到
- `500`: 服务器内部错误