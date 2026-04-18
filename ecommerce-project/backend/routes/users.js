const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    获取当前用户信息
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    更新用户资料
// @route   PUT /api/users/profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('姓名长度在2-50个字符之间'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('请输入有效的邮箱地址'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('密码至少6位')
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

      const { name, email, password } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      await user.update(updateData);
      await user.reload();

      res.json({
        success: true,
        message: '用户资料更新成功',
        data: {
          user
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被使用'
        });
      }
      console.error('更新用户资料错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    获取所有用户（管理员）
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    获取用户详情（管理员）
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户未找到'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    更新用户（管理员）
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('姓名长度在2-50个字符之间'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('请输入有效的邮箱地址'),
    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('角色必须是user或admin'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive必须是布尔值')
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

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户未找到'
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

      res.json({
        success: true,
        message: '用户更新成功',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被使用'
        });
      }
      console.error('更新用户错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    删除用户（管理员）
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户未找到'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: '不能删除管理员账户'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

module.exports = router;