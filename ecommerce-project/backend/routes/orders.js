const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, Product } = require('../models');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    创建订单
// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  protect,
  [
    body('orderItems')
      .isArray({ min: 1 })
      .withMessage('订单商品不能为空'),
    body('shippingAddress')
      .exists()
      .withMessage('配送地址不能为空'),
    body('paymentMethod')
      .isIn(['支付宝', '微信支付', '银行卡', '货到付款'])
      .withMessage('请选择有效的支付方式'),
    body('itemsPrice')
      .isFloat({ min: 0 })
      .withMessage('商品价格必须为非负数'),
    body('shippingPrice')
      .isFloat({ min: 0 })
      .withMessage('运费必须为非负数'),
    body('taxPrice')
      .isFloat({ min: 0 })
      .withMessage('税费必须为非负数'),
    body('totalPrice')
      .isFloat({ min: 0 })
      .withMessage('总价必须为非负数')
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

      const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: '没有订单商品'
        });
      }

      // 检查商品库存
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `商品 ${item.name} 库存不足`
          });
        }
      }

      // 创建订单
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      });

      const createdOrder = await order.save();

      res.status(201).json({
        success: true,
        message: '订单创建成功',
        data: { order: createdOrder }
      });
    } catch (error) {
      console.error('创建订单错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    获取当前用户的订单
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name image price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('获取用户订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    获取订单详情
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单未找到'
      });
    }

    // 检查订单是否属于当前用户或管理员
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此订单'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('获取订单详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    更新订单支付状态
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单未找到'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权更新此订单'
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = req.body.paymentResult;
    order.orderStatus = '已付款';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: '订单支付成功',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('更新支付状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    获取所有订单（管理员）
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('获取订单列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    更新订单配送状态（管理员）
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单未找到'
      });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.orderStatus = '已完成';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: '订单标记为已配送',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('更新配送状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

module.exports = router;