@echo off
echo 正在测试前端依赖安装...
echo.

cd /d %~dp0

echo 步骤1: 清理npm缓存
npm cache clean --force
if %errorlevel% neq 0 (
    echo npm缓存清理失败
    pause
    exit /b 1
)
echo ✓ npm缓存清理完成

echo.
echo 步骤2: 删除旧的依赖文件
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo ✓ 旧依赖文件已删除

echo.
echo 步骤3: 安装依赖
npm install
if %errorlevel% neq 0 (
    echo.
    echo ⚠ 标准安装失败，尝试使用legacy模式...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        echo 请检查网络连接或手动运行: npm install --legacy-peer-deps
        pause
        exit /b 1
    )
)

echo.
echo ✅ 依赖安装成功!
echo 现在可以运行: npm start
pause