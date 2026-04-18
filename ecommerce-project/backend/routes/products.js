const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Product, ProductReview, User } = require('../models');
const { Op } = require('sequelize');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    获取所有商品
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须为正整数'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量在1-100之间'),
    query('category').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('search').optional().isString(),
    query('sort').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '查询参数验证失败',
          errors: errors.array()
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // 构建查询条件
      const where = { is_active: true };

      if (req.query.category) {
        where.category = req.query.category;
      }

      if (req.query.minPrice) {
        where.price = { [Op.gte]: parseFloat(req.query.minPrice) };
      }

      if (req.query.maxPrice) {
        where.price = where.price || {};
        where.price[Op.lte] = parseFloat(req.query.maxPrice);
      }

      if (req.query.search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${req.query.search}%` } },
          { description: { [Op.like]: `%${req.query.search}%` } }
        ];
      }

      // 排序
      let order = [];
      if (req.query.sort) {
        switch (req.query.sort) {
          case 'price_asc':
            order = [['price', 'ASC']];
            break;
          case 'price_desc':
            order = [['price', 'DESC']];
            break;
          case 'newest':
            order = [['created_at', 'DESC']];
            break;
          case 'popular':
            order = [['sales_count', 'DESC']];
            break;
          default:
            order = [['created_at', 'DESC']];
        }
      } else {
        order = [['created_at', 'DESC']];
      }

      // 执行查询
      const { count, rows: products } = await Product.findAndCountAll({
        where,
        order,
        offset,
        limit,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name'] }
        ]
      });

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('获取商品列表错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    获取单个商品详情
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        {
          model: ProductReview,
          as: 'reviews',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    if (!product.is_active) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('获取商品详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    创建新商品
// @route   POST /api/products
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('商品名称长度在2-100个字符之间'),
    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('商品描述至少10个字符'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('价格必须为非负数'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('库存必须为非负整数'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('商品分类不能为空')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '验证失败',
          errors: errors.array()
        });
      }

      const { name, description, price, stock, category, images } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        images: images || [],
        created_by: req.user.id
      });

      res.status(201).json({
        success: true,
        message: '商品创建成功',
        data: { product }
      });
    } catch (error) {
      console.error('创建商品错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    更新商品
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('商品名称长度在2-100个字符之间'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('商品描述至少10个字符'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('价格必须为非负数'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('库存必须为非负整数'),
    body('category')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('商品分类不能为空')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '验证失败',
          errors: errors.array()
        });
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      const { name, description, price, stock, category, images, is_active } = req.body;

      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        category: category || product.category,
        images: images || product.images,
        is_active: is_active !== undefined ? is_active : product.is_active
      });

      res.json({
        success: true,
        message: '商品更新成功',
        data: { product }
      });
    } catch (error) {
      console.error('更新商品错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    删除商品
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: '商品删除成功'
    });
  } catch (error) {
    console.error('删除商品错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

module.exports = router;