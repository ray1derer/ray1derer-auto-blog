#!/bin/bash

echo "🚀 EC2 초기 설정 시작..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트..."
sudo apt-get update
sudo apt-get upgrade -y

# Docker 설치
echo "🐳 Docker 설치..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Docker Compose 설치
echo "🐳 Docker Compose 설치..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 현재 사용자를 docker 그룹에 추가
echo "👤 사용자를 docker 그룹에 추가..."
sudo usermod -aG docker $USER

# Git 설치
echo "📚 Git 설치..."
sudo apt-get install -y git

# Node.js 설치 (선택사항)
echo "📗 Node.js 설치..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 방화벽 설정
echo "🔥 방화벽 설정..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

echo "✅ EC2 초기 설정 완료!"
echo "⚠️  Docker 그룹 변경사항을 적용하려면 로그아웃 후 다시 로그인하세요."
echo ""
echo "다음 단계:"
echo "1. git clone https://github.com/ray1derer/ray1derer-auto-blog.git"
echo "2. cd ray1derer-auto-blog"
echo "3. docker-compose up -d"