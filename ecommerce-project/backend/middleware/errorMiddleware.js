const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 日志记录错误
  console.error('错误:', err);

  // Sequelize 错误处理
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message);
    error = { message, statusCode: 400 };
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = '重复的字段值';
    error = { message, statusCode: 400 };
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = '外键约束错误';
    error = { message, statusCode: 400 };
  }

  if (err.name === 'SequelizeDatabaseError') {
    const message = '数据库错误';
    error = { message, statusCode: 500 };
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token已过期';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || '服务器错误',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`路径 ${req.originalUrl} 未找到`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };