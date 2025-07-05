#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# EC2 정보
EC2_IP=$1
KEY_PATH="~/.ssh/your-key.pem"  # SSH 키 경로를 수정하세요

if [ -z "$EC2_IP" ]; then
    echo -e "${RED}사용법: ./deploy_to_ec2.sh [EC2-IP-주소]${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 ray1derer-auto-blog EC2 배포 시작${NC}"
echo -e "${YELLOW}대상 서버: $EC2_IP${NC}"

# 1. 로컬에서 빌드
echo -e "${GREEN}📦 프로젝트 빌드 중...${NC}"
npm run build

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
    # 기존 컨테이너 중지
    cd ray1derer-auto-blog 2>/dev/null && docker-compose down || true
    
    # 백업
    if [ -d "ray1derer-auto-blog" ]; then
        sudo mv ray1derer-auto-blog ray1derer-auto-blog.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # 압축 해제
    mkdir ray1derer-auto-blog
    tar -xzf ray1derer-auto-blog.tar.gz -C ray1derer-auto-blog
    cd ray1derer-auto-blog
    
    # 환경 변수 파일 생성 (필요시)
    cat > .env << EOL
NODE_ENV=production
DATABASE_URL=your_database_url_here
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