#!/bin/bash

# 빠른 배포 스크립트 - EC2에서 복사-붙여넣기로 실행
# curl -sSL https://raw.githubusercontent.com/ray1derer/ray1derer-auto-blog/main/quick_deploy.sh | bash

echo "🚀 Ray1derer Auto Blog 빠른 배포 시작..."

# 1. 프로젝트 클론 또는 업데이트
if [ -d "ray1derer-auto-blog" ]; then
    cd ray1derer-auto-blog
    git pull
else
    git clone https://github.com/ray1derer/ray1derer-auto-blog.git
    cd ray1derer-auto-blog
fi

# 2. 실행 권한 부여
chmod +x deploy_rds_setup.sh

# 3. 배포 스크립트 실행
./deploy_rds_setup.sh