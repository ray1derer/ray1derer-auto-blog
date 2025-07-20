#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# EC2 정보
EC2_IP=$1
KEY_PATH="~/.ssh/artisan.pem"  # Artisan 서버 SSH 키

if [ -z "$EC2_IP" ]; then
    echo -e "${RED}사용법: ./deploy_to_ec2.sh [EC2-IP-주소]${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 ray1derer-auto-blog EC2 배포 시작${NC}"
echo -e "${YELLOW}대상 서버: $EC2_IP${NC}"

# 1. 로컬 빌드 스킵 (Docker에서 빌드)
echo -e "${GREEN}📦 프로젝트 준비 중...${NC}"

# 2. 프로젝트 압축
echo -e "${GREEN}📦 프로젝트 압축 중...${NC}"
tar -czf ray1derer-auto-blog.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='.env.local' \
  .

# 3. EC2로 전송
echo -e "${GREEN}📤 EC2로 파일 전송 중...${NC}"
scp -i $KEY_PATH ray1derer-auto-blog.tar.gz ubuntu@$EC2_IP:~/

# 4. EC2에서 배포 실행
echo -e "${GREEN}🔧 EC2에서 배포 스크립트 실행 중...${NC}"
ssh -i $KEY_PATH ubuntu@$EC2_IP << 'EOF'
    # 기존 컨테이너 완전 정리
    cd ray1derer-auto-blog 2>/dev/null && docker-compose down -v || true
    docker system prune -af || true
    
    # 기존 디렉토리 완전 삭제
    sudo rm -rf ray1derer-auto-blog
    sudo rm -rf ray1derer-auto-blog.backup.*
    
    # 압축 해제
    mkdir ray1derer-auto-blog
    tar -xzf ray1derer-auto-blog.tar.gz -C ray1derer-auto-blog
    cd ray1derer-auto-blog
    
    # 환경 변수 파일 생성 (필요시)
    cat > .env << EOL
NODE_ENV=production
DATABASE_URL=postgresql://localhost:5432/ray1derer_blog
NEXT_PUBLIC_APP_URL=http://54.180.94.235
EOL
    
    # Docker 빌드 및 실행
    docker-compose build
    docker-compose up -d
    
    # 상태 확인
    docker-compose ps
    
    # 정리
    cd ..
    rm ray1derer-auto-blog.tar.gz
EOF

# 5. 로컬 정리
rm ray1derer-auto-blog.tar.gz

echo -e "${GREEN}✅ 배포 완료!${NC}"
echo -e "${YELLOW}접속 주소: http://$EC2_IP${NC}"
echo -e "${YELLOW}로그 확인: ssh -i $KEY_PATH ubuntu@$EC2_IP 'cd ray1derer-auto-blog && docker-compose logs -f'${NC}"