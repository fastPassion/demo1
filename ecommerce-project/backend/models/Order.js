const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_items: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('order_items');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('order_items', JSON.stringify(value));
    }
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('shipping_address');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('shipping_address', JSON.stringify(value));
    }
  },
  payment_method: {
    type: DataTypes.ENUM('支付宝', '微信支付', '银行卡', '货到付款'),
    allowNull: false
  },
  payment_result: {
    type: DataTypes.JSON,
    get() {
      const rawValue = this.getDataValue('payment_result');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('payment_result', JSON.stringify(value));
    }
  },
  items_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  shipping_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  tax_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paid_at: {
    type: DataTypes.DATE
  },
  is_delivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  delivered_at: {
    type: DataTypes.DATE
  },
  order_status: {
    type: DataTypes.ENUM('待付款', '已付款', '已发货', '已完成', '已取消'),
    defaultValue: '待付款'
  },
  order_notes: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (order) => {
      order.items_price = order.order_items.reduce(
        (acc, item) => acc + (item.price * item.quantity),
        0
      );
      order.total_price = order.items_price + order.shipping_price + order.tax_price;
    },
    beforeUpdate: (order) => {
      if (order.changed('order_items') || order.changed('shipping_price') || order.changed('tax_price')) {
        order.items_price = order.order_items.reduce(
          (acc, item) => acc + (item.price * item.quantity),
          0
        );
        order.total_price = order.items_price + order.shipping_price + order.tax_price;
      }
    }
  }
});

module.exports = Order;