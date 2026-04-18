const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const ProductReview = require('./ProductReview');
const Order = require('./Order');

// 定义模型关系
User.hasMany(ProductReview, {
  foreignKey: 'user_id',
  as: 'reviews'
});
ProductReview.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Product.hasMany(ProductReview, {
  foreignKey: 'product_id',
  as: 'reviews'
});
ProductReview.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders'
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(Product, {
  foreignKey: 'created_by',
  as: 'created_products'
});
Product.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

// 导出所有模型
module.exports = {
  sequelize,
  User,
  Product,
  ProductReview,
  Order
};