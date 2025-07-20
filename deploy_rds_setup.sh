#!/bin/bash

# AWS RDS PostgreSQL 자동 배포 스크립트
# EC2에서 실행하세요: bash deploy_rds_setup.sh

set -e

echo "🚀 AWS RDS PostgreSQL 설정 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 프로젝트 디렉토리
PROJECT_DIR=~/ray1derer-auto-blog

# 1. 프로젝트 업데이트
echo -e "${YELLOW}📦 프로젝트 업데이트 중...${NC}"
cd $PROJECT_DIR
git pull origin main

# 2. 환경변수 설정
echo -e "${YELLOW}🔧 환경변수 설정...${NC}"
cat > .env.production << 'EOF'
# AWS RDS PostgreSQL (로컬 테스트용 - 실제 RDS 엔드포인트로 변경 필요)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ray1derer_blog?schema=public"

# AWS 설정
AWS_REGION="ap-northeast-2"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# S3 설정 (미디어 저장용)
AWS_S3_BUCKET="ray1derer-blog-media"
AWS_S3_REGION="ap-northeast-2"

# NextAuth 설정
NEXTAUTH_URL="http://3.36.71.187"
NEXTAUTH_SECRET="your-secure-secret-here-32-characters"

# 암호화 키
ENCRYPTION_KEY="32-character-secure-encryption-key"
EOF

echo -e "${RED}⚠️  중요: .env.production 파일을 편집하여 실제 RDS 정보를 입력하세요${NC}"
echo "nano .env.production"
echo ""
read -p "환경변수를 설정하셨나요? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "환경변수 설정 후 다시 실행해주세요."
    exit 1
fi

# 3. Docker 중지
echo -e "${YELLOW}🛑 기존 Docker 컨테이너 중지...${NC}"
docker-compose down || true

# 4. 패키지 설치
echo -e "${YELLOW}📦 NPM 패키지 설치...${NC}"
npm install

# 5. Prisma 설정
echo -e "${YELLOW}🗄️ Prisma 설정...${NC}"
npx prisma generate

# 6. 데이터베이스 마이그레이션
echo -e "${YELLOW}🔄 데이터베이스 마이그레이션...${NC}"
echo "RDS가 준비되었는지 확인합니다..."
npx prisma migrate deploy || {
    echo -e "${RED}❌ 데이터베이스 연결 실패. RDS 설정을 확인하세요.${NC}"
    echo "1. RDS 인스턴스가 실행 중인지 확인"
    echo "2. 보안 그룹 설정 확인 (EC2 → RDS 5432 포트)"
    echo "3. DATABASE_URL이 올바른지 확인"
    exit 1
}

# 7. 데이터 마이그레이션
echo -e "${YELLOW}📊 기존 데이터 마이그레이션...${NC}"
read -p "localStorage 데이터를 RDS로 마이그레이션하시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run migrate:data || echo -e "${YELLOW}⚠️  마이그레이션 스크립트가 없습니다. 수동으로 진행하세요.${NC}"
fi

# 8. Docker Compose 업데이트
echo -e "${YELLOW}🐳 Docker Compose 설정 업데이트...${NC}"
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# 9. Docker 이미지 빌드 및 실행
echo -e "${YELLOW}🚀 Docker 컨테이너 시작...${NC}"
docker-compose up -d --build

# 10. 상태 확인
echo -e "${YELLOW}✅ 배포 상태 확인...${NC}"
sleep 10
docker-compose ps

# 11. 헬스체크
echo -e "${YELLOW}🏥 애플리케이션 헬스체크...${NC}"
curl -f http://localhost/api/health || echo -e "${YELLOW}⚠️  헬스체크 API가 없습니다.${NC}"

echo -e "${GREEN}✅ RDS 설정 완료!${NC}"
echo ""
echo "다음 단계:"
echo "1. AWS RDS 콘솔에서 데이터베이스 생성"
echo "2. .env.production 파일에 RDS 엔드포인트 입력"
echo "3. 보안 그룹 설정 (EC2 ↔ RDS)"
echo "4. 이 스크립트 다시 실행"
echo ""
echo "접속 URL: http://3.36.71.187"