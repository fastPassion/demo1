const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [2, 200],
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000],
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      notNull: true
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  category: {
    type: DataTypes.ENUM(
      '电子产品',
      '服装鞋帽',
      '家用电器',
      '图书音像',
      '运动户外',
      '美妆护肤',
      '食品饮料',
      '家居生活',
      '母婴用品',
      '其他'
    ),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(100),
    validate: {
      len: [0, 100]
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    validate: {
      min: 0
    }
  },
  dimensions: {
    type: DataTypes.JSON,
    get() {
      const rawValue = this.getDataValue('dimensions');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('dimensions', JSON.stringify(value));
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  num_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value));
    }
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 计算平均评分
Product.prototype.calculateAverageRating = function() {
  return Product.sequelize.query(
    `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
     FROM product_reviews
     WHERE product_id = ?`,
    {
      replacements: [this.id],
      type: sequelize.QueryTypes.SELECT
    }
  ).then(([result]) => {
    this.rating = result.avg_rating || 0;
    this.num_reviews = result.review_count || 0;
    return this.save();
  });
};

// 更新库存
Product.prototype.updateStock = async function(quantity) {
  if (this.stock + quantity < 0) {
    throw new Error('库存不足');
  }
  this.stock += quantity;
  return await this.save();
};

module.exports = Product;