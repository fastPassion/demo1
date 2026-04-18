const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

// 生成JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    用户注册
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('姓名长度在2-50个字符之间'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('请输入有效的邮箱地址'),
    body('password')
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

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被注册'
        });
      }

      // 创建用户
      const user = await User.create({
        name,
        email,
        password
      });

      if (user) {
        const token = generateToken(user.id);

        res.status(201).json({
          success: true,
          message: '注册成功',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role
            },
            token
          }
        });
      }
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('请输入有效的邮箱地址'),
    body('password')
      .exists()
      .withMessage('请输入密码')
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

      const { email, password } = req.body;

      // 查找用户
      const user = await User.findOne({ where: { email } });

      if (user && (await user.matchPassword(password))) {
        if (!user.is_active) {
          return res.status(401).json({
            success: false,
            message: '账户已被禁用'
          });
        }

        // 更新最后登录时间
        user.updateLastLogin();

        const token = generateToken(user.id);

        res.json({
          success: true,
          message: '登录成功',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role
            },
            token
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: '邮箱或密码错误'
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
);

// @desc    获取当前用户信息
// @route   GET /api/auth/me
// @access  Private
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// @desc    用户登出
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: '登出成功'
    });
  } catch (error) {
    console.error('登出错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

module.exports = router;