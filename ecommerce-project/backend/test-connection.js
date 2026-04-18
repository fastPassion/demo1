const sequelize = require('./config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL数据库连接成功!');

    // 测试同步
    await sequelize.sync({ alter: false });
    console.log('✅ 数据库模型同步成功!');

    console.log('🎉 所有测试通过，后端可以正常启动!');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

testConnection();