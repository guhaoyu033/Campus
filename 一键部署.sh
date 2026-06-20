#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear
echo ""
echo "=================================================="
echo "   校园智转 CampusFlow - 一键部署工具"
echo "=================================================="
echo ""
echo "请选择部署方式:"
echo ""
echo "  ${GREEN}[1]${NC} 本地预览 (推荐，先看效果)"
echo "  ${CYAN}[2]${NC} 部署到 Netlify (免费公网链接)"
echo "  ${BLUE}[3]${NC} 部署到 Vercel (免费公网链接)"
echo "  ${YELLOW}[4]${NC} 打开 Netlify Drop 网页 (拖放部署，最推荐)"
echo "  ${GREEN}[5]${NC} 本地预览 (Python 方式)"
echo "  ${YELLOW}[6]${NC} 打开离线单文件版本"
echo "  [0] 退出"
echo ""
read -p "请输入选项: " choice

case $choice in
  1)
    echo ""
    echo "=> 启动本地开发服务器..."
    if ! command -v npm &> /dev/null; then
      echo "[x] 未检测到 npm，请先安装 Node.js: https://nodejs.org/"
      exit 1
    fi
    npm install
    npm run dev
    ;;
  2)
    echo ""
    echo "=> 部署到 Netlify..."
    if ! command -v npx &> /dev/null; then
      echo "[x] 未检测到 npx，请先安装 Node.js"
      exit 1
    fi
    echo ""
    echo "正在部署 dist 目录到 Netlify..."
    echo "如果是第一次使用，浏览器会弹出授权页面"
    echo ""
    npx --yes netlify-cli deploy --prod --dir=dist
    ;;
  3)
    echo ""
    echo "=> 部署到 Vercel..."
    if ! command -v npx &> /dev/null; then
      echo "[x] 未检测到 npx，请先安装 Node.js"
      exit 1
    fi
    echo ""
    echo "正在部署到 Vercel..."
    echo "如果是第一次使用，浏览器会弹出授权页面"
    echo ""
    npx --yes vercel --prod --yes
    ;;
  4)
    echo ""
    echo "=> 打开 Netlify Drop 网页..."
    echo "请把 dist 文件夹拖到网页中，几秒钟即可获得公网链接！"
    if command -v open &> /dev/null; then
      open "https://app.netlify.com/drop"
    elif command -v xdg-open &> /dev/null; then
      xdg-open "https://app.netlify.com/drop"
    else
      echo "请手动打开: https://app.netlify.com/drop"
    fi
    echo ""
    echo "dist 目录位置: $DIR/dist"
    if command -v open &> /dev/null; then
      open "$DIR/dist"
    elif command -v xdg-open &> /dev/null; then
      xdg-open "$DIR/dist"
    fi
    ;;
  5)
    echo ""
    echo "=> 启动本地 Python HTTP 服务器..."
    if command -v python3 &> /dev/null; then
      echo "服务器已启动，请打开浏览器访问: http://localhost:8088"
      echo "按 Ctrl+C 退出"
      cd dist && python3 -m http.server 8088
    elif command -v python &> /dev/null; then
      echo "服务器已启动，请打开浏览器访问: http://localhost:8088"
      echo "按 Ctrl+C 退出"
      cd dist && python -m SimpleHTTPServer 8088
    else
      echo "[x] 未检测到 Python"
      echo "请安装 Python 或选择其他方式"
      exit 1
    fi
    ;;
  6)
    echo ""
    echo "=> 打开离线单文件版本..."
    if [ -f "dist/campusflow-offline.html" ]; then
      if command -v open &> /dev/null; then
        open "dist/campusflow-offline.html"
      elif command -v xdg-open &> /dev/null; then
        xdg-open "dist/campusflow-offline.html"
      else
        echo "请手动打开: dist/campusflow-offline.html"
      fi
      echo "已在默认浏览器中打开"
    else
      echo "[x] 未找到 dist/campusflow-offline.html"
      echo "请先在项目根目录运行: npm install && npm run build"
      exit 1
    fi
    ;;
  0)
    echo "退出"
    exit 0
    ;;
  *)
    echo "无效选项"
    exit 1
    ;;
esac
