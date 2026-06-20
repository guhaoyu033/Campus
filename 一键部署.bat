@echo off
chcp 65001 >nul
title 校园智转 CampusFlow - 一键部署
cd /d "%~dp0"

echo.
echo ==================================================
echo   校园智转 CampusFlow - 一键部署工具 (Windows)
echo ==================================================
echo.
echo 请选择部署方式:
echo.
echo   [1] 本地预览 (推荐，先看效果)
echo   [2] 部署到 Netlify (需要 npx，免费公网链接)
echo   [3] 部署到 Vercel (需要 npx，免费公网链接)
echo   [4] 打开 Netlify Drop 网页 (拖放部署，最推荐)
echo   [5] 本地预览 (Python 方式)
echo   [6] 查看离线单文件版本
echo   [0] 退出
echo.
set /p choice=请输入选项: 

if "%choice%"=="1" goto :dev
if "%choice%"=="2" goto :netlify
if "%choice%"=="3" goto :vercel
if "%choice%"=="4" goto :netlify-drop
if "%choice%"=="5" goto :python-http
if "%choice%"=="6" goto :offline
if "%choice%"=="0" goto :eof

echo 无效选项
pause
goto :eof

:dev
echo.
echo [1] 启动本地开发服务器...
where npm >nul 2>nul
if errorlevel 1 (
    echo [x] 未检测到 npm，请先安装 Node.js: https://nodejs.org/
    pause
    goto :eof
)
call npm install
call npm run dev
goto :eof

:netlify
echo.
echo [2] 部署到 Netlify...
where npx >nul 2>nul
if errorlevel 1 (
    echo [x] 未检测到 npx，请先安装 Node.js
    pause
    goto :eof
)
echo.
echo 正在部署 dist 目录到 Netlify...
echo 如果是第一次使用，浏览器会弹出授权页面
echo.
call npx --yes netlify-cli deploy --prod --dir=dist
goto :eof

:vercel
echo.
echo [3] 部署到 Vercel...
where npx >nul 2>nul
if errorlevel 1 (
    echo [x] 未检测到 npx，请先安装 Node.js
    pause
    goto :eof
)
echo.
echo 正在部署到 Vercel...
echo 如果是第一次使用，浏览器会弹出授权页面
echo.
call npx --yes vercel --prod --yes
goto :eof

:netlify-drop
echo.
echo [4] 正在打开 Netlify Drop 网页...
echo 请把 dist 文件夹拖到网页中，几秒钟即可获得公网链接！
start "" "https://app.netlify.com/drop"
echo.
echo 同时打开 dist 文件夹位置...
explorer "%~dp0dist"
pause
goto :eof

:python-http
echo.
echo [5] 启动本地 Python HTTP 服务器...
where python >nul 2>nul
if not errorlevel 1 (
    echo 服务器已启动，请打开浏览器访问: http://localhost:8088
    echo 按 Ctrl+C 退出
    cd dist
    python -m http.server 8088
    goto :eof
)
where python3 >nul 2>nul
if not errorlevel 1 (
    echo 服务器已启动，请打开浏览器访问: http://localhost:8088
    echo 按 Ctrl+C 退出
    cd dist
    python3 -m http.server 8088
    goto :eof
)
echo [x] 未检测到 Python
echo 请安装 Python 或选择其他方式
pause
goto :eof

:offline
echo.
echo [6] 打开离线单文件版本...
if exist "dist\campusflow-offline.html" (
    start "" "%~dp0dist\campusflow-offline.html"
    echo 已在默认浏览器中打开
) else (
    echo [x] 未找到 dist\campusflow-offline.html
    echo 请先在项目根目录运行: npm install  ^&^&  npm run build
)
pause
goto :eof

:eof
