# 🖥️ Ray1derer Auto Blog 서버 정보

## AWS EC2 인스턴스 정보

### 서버 접속 정보
- **인스턴스 ID**: i-0a227cf6560e78bc3
- **리전**: ap-northeast-2 (서울)
- **인스턴스 타입**: t2.micro (또는 현재 사용 중인 타입)
- **퍼블릭 IP**: 3.36.71.187
- **퍼블릭 DNS**: ec2-3-36-71-187.ap-northeast-2.compute.amazonaws.com
- **프라이빗 IP**: 172.31.41.124

### SSH 접속 방법
```bash
# PEM 키 파일을 사용한 접속
ssh -i "your-key.pem" ubuntu@3.36.71.187

# 또는 root 사용자로 접속 (설정된 경우)
ssh -i "your-key.pem" root@3.36.71.187
```

### 보안 그룹 설정
- **SSH (22)**: 본인 IP만 허용
- **HTTP (80)**: 0.0.0.0/0
- **HTTPS (443)**: 0.0.0.0/0 (SSL 설정 시)
- **PostgreSQL (5432)**: RDS 보안 그룹만 허용 (RDS 사용 시)

## 프로젝트 구조

### 디렉토리 위치
- 프로젝트 위치: `/root/ray1derer-auto-blog`
- Docker Compose 파일: `/root/ray1derer-auto-blog/docker-compose.yml`
- 환경변수 파일: `/root/ray1derer-auto-blog/.env.production`

### 주요 명령어

#### 프로젝트 업데이트
```bash
cd ~/ray1derer-auto-blog
git pull origin main
```

#### Docker 관리
```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 재시작
docker-compose restart

# 전체 재배포
docker-compose down
docker-compose up -d --build
```

#### 디스크 공간 관리
```bash
# 디스크 사용량 확인
df -h

# Docker 정리
docker system prune -a -f
docker volume prune -f

# 로그 정리
sudo journalctl --vacuum-size=100M
```

## 환경 설정

### 필요한 환경변수 (.env.production)
```env
# 데이터베이스 (현재 로컬, 추후 RDS로 변경)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ray1derer_blog?schema=public"

# AWS 설정
AWS_REGION="ap-northeast-2"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# S3 설정
AWS_S3_BUCKET="ray1derer-blog-media"
AWS_S3_REGION="ap-northeast-2"

# NextAuth 설정
NEXTAUTH_URL="http://3.36.71.187"
NEXTAUTH_SECRET="your-32-char-secret"

# 암호화 키
ENCRYPTION_KEY="32-character-encryption-key"
```

## 배포 프로세스

### 1. 초기 설정 (새 서버)
```bash
# 프로젝트 클론
git clone https://github.com/ray1derer/ray1derer-auto-blog.git
cd ray1derer-auto-blog

# 배포 스크립트 실행
chmod +x deploy_rds_setup.sh
./deploy_rds_setup.sh
```

### 2. 업데이트 배포
```bash
cd ~/ray1derer-auto-blog
git pull
docker-compose down
docker-compose up -d --build
```

### 3. 빠른 배포 (원라이너)
```bash
curl -sSL https://raw.githubusercontent.com/ray1derer/ray1derer-auto-blog/main/quick_deploy.sh | bash
```

## 모니터링

### 서비스 상태 확인
- 웹사이트: http://3.36.71.187
- 대시보드: http://3.36.71.187
- API 헬스체크: http://3.36.71.187/api/health

### 로그 위치
- Docker 로그: `docker-compose logs -f app`
- Nginx 로그: `docker-compose logs -f nginx`
- 시스템 로그: `sudo journalctl -u docker -f`

## 트러블슈팅

### 디스크 공간 부족
```bash
# 정리 스크립트 실행
docker system prune -a -f
npm cache clean --force
sudo apt-get clean
```

### 포트 충돌
```bash
# 사용 중인 포트 확인
sudo lsof -i :80
sudo lsof -i :3000
```

### Docker 문제
```bash
# Docker 재시작
sudo systemctl restart docker
```

## 백업 및 복구

### 데이터 백업
```bash
# localStorage 백업 (현재)
# 추후 PostgreSQL 백업 명령어 추가
```

### 복구
```bash
# 백업에서 복구하는 방법
# 추후 작성
```

## 보안 주의사항

⚠️ **중요**: 
- PEM 키 파일은 절대 GitHub에 업로드하지 마세요
- AWS 액세스 키는 환경변수로만 관리하세요
- 프로덕션 비밀번호는 AWS Secrets Manager 사용을 권장합니다
- 정기적으로 보안 업데이트를 적용하세요

## 연락처 및 지원

- GitHub: https://github.com/ray1derer/ray1derer-auto-blog
- 이슈 리포트: https://github.com/ray1derer/ray1derer-auto-blog/issues

---

마지막 업데이트: 2025년 7월 20일