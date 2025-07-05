# 🚀 ray1derer-auto-blog EC2 배포 가이드

## 1. EC2 인스턴스 준비

### 인스턴스 설정
- **AMI**: Ubuntu Server 22.04 LTS
- **인스턴스 타입**: t2.micro (프리티어) 또는 t3.small
- **보안 그룹**:
  - SSH (22): 내 IP
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0
  - Custom TCP (3000): 0.0.0.0/0

## 2. EC2 초기 설정

```bash
# SSH 접속
ssh -i ~/.ssh/your-key.pem ubuntu@[EC2-IP]

# 초기 설정 스크립트 다운로드 및 실행
wget https://raw.githubusercontent.com/ray1derer/ray1derer-auto-blog/main/setup_ec2.sh
chmod +x setup_ec2.sh
./setup_ec2.sh
```

## 3. 프로젝트 배포

### 방법 1: GitHub에서 직접 클론
```bash
# 프로젝트 클론
git clone https://github.com/ray1derer/ray1derer-auto-blog.git
cd ray1derer-auto-blog

# 환경 변수 설정
cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/autoblog
EOF

# Docker Compose로 실행
docker-compose up -d
```

### 방법 2: 로컬에서 배포 스크립트 사용
```bash
# 로컬에서 실행
./deploy_to_ec2.sh [EC2-IP]
```

## 4. 서비스 확인

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 서비스 재시작
docker-compose restart
```

## 5. 접속 확인

- 웹사이트: `http://[EC2-IP]`
- 대시보드: `http://[EC2-IP]/`

## 6. SSL 설정 (선택사항)

```bash
# Certbot 설치
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# SSL 인증서 발급
sudo certbot certonly --standalone -d your-domain.com

# nginx.conf 수정하여 SSL 설정 추가
```

## 7. 업데이트 방법

```bash
# EC2에서 실행
cd ray1derer-auto-blog
git pull origin main
docker-compose build
docker-compose up -d
```

## 8. 백업

```bash
# 데이터 백업 (추후 DB 연동 시)
docker-compose exec db pg_dump -U postgres autoblog > backup_$(date +%Y%m%d).sql
```

## 📝 참고사항

- 첫 배포 시 빌드에 5-10분 소요될 수 있습니다
- 프리티어 인스턴스의 경우 메모리가 부족할 수 있으니 swap 파일 설정을 권장합니다
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요

## 🔧 문제 해결

### Docker 권한 오류
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 메모리 부족
```bash
# Swap 파일 생성 (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```