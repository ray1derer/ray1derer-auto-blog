# 🚀 Ray1derer Auto Blog - AWS EC2 배포 가이드 및 프로젝트 현황

## 📊 프로젝트 분석 요약

### 기술 스택
- **Frontend**: Next.js 15.3.5, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI 기반)
- **자동화**: Playwright (스크린샷 캡처)
- **배포**: Docker, Docker Compose, Nginx
- **데이터 저장**: LocalStorage (현재), PostgreSQL (예정)

### 주요 기능
1. **포스트 관리**: 마크다운 편집기, 실시간 미리보기, 카테고리/태그 관리
2. **AI 스크린샷**: Playwright 기반 자동 웹사이트 스크린샷 캡처
3. **멀티 플랫폼**: 6개 블로그 플랫폼 동시 발행 지원
4. **예약 발행**: 날짜/시간 기반 자동 발행
5. **강좌 콘텐츠**: 135개 정적 HTML 강좌 (노션, 옵시디언, 커서AI, 클로드AI)

## 🔧 AWS EC2 배포 준비

### 1. EC2 인스턴스 요구사항
- **AMI**: Ubuntu Server 22.04 LTS
- **인스턴스 타입**: t2.micro (프리티어) 또는 t3.small
- **스토리지**: 최소 20GB
- **보안 그룹 인바운드 규칙**:
  ```
  - SSH (22): 내 IP
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0
  - Custom TCP (3000): 0.0.0.0/0 (개발용)
  ```

### 2. 배포 파일 구조
```
ray1derer-auto-blog/
├── Dockerfile              # Next.js 앱 Docker 이미지
├── docker-compose.yml      # 멀티 컨테이너 구성
├── nginx.conf             # Nginx 리버스 프록시 설정
├── setup_ec2.sh           # EC2 초기 설정 스크립트
├── deploy_to_ec2.sh       # 배포 자동화 스크립트
└── EC2_배포_가이드.md      # 상세 배포 가이드
```

## 📋 배포 단계별 가이드

### Step 1: EC2 인스턴스 생성
1. AWS 콘솔에서 EC2 인스턴스 생성
2. Ubuntu 22.04 LTS 선택
3. 키 페어 생성 및 다운로드 (.pem 파일)
4. 보안 그룹 설정 (위의 인바운드 규칙 적용)

### Step 2: EC2 접속 및 초기 설정
```bash
# 로컬에서 실행
chmod 400 ~/.ssh/your-key.pem
ssh -i ~/.ssh/your-key.pem ubuntu@[EC2-퍼블릭-IP]

# EC2에서 실행
wget https://raw.githubusercontent.com/ray1derer/ray1derer-auto-blog/main/setup_ec2.sh
chmod +x setup_ec2.sh
./setup_ec2.sh
```

### Step 3: 프로젝트 배포

#### 옵션 A: GitHub에서 직접 클론
```bash
# EC2에서 실행
git clone https://github.com/ray1derer/ray1derer-auto-blog.git
cd ray1derer-auto-blog

# 환경 변수 설정
cat > .env << EOF
NODE_ENV=production
# 추가 환경 변수 필요시 여기에 추가
EOF

# Docker Compose 실행
docker-compose up -d
```

#### 옵션 B: 로컬에서 배포 스크립트 사용
```bash
# 로컬에서 실행
cd /path/to/ray1derer-auto-blog
./deploy_to_ec2.sh [EC2-퍼블릭-IP]
```

### Step 4: 배포 확인
```bash
# EC2에서 실행
docker-compose ps
docker-compose logs -f

# 브라우저에서 접속
http://[EC2-퍼블릭-IP]
```

## 🔍 현재 프로젝트 상태

### ✅ 구현 완료
- 기본 CRUD 기능 (포스트 생성, 읽기, 수정, 삭제)
- 동적 카테고리 관리
- 예약 발행 시스템
- 135개 강좌 콘텐츠
- Docker 기반 배포 환경
- Playwright 스크린샷 자동화

### 🚧 진행 중
- 실제 블로그 플랫폼 API 연동
- 데이터베이스 통합 (PostgreSQL)
- 사용자 인증 시스템 (NextAuth.js)
- 통계 대시보드 개선

### 📅 향후 계획
- AI 콘텐츠 생성 통합
- 이미지 업로드 및 관리
- SEO 최적화
- 다크 모드 개선
- 다국어 지원

## 🛠️ 트러블슈팅

### 1. 메모리 부족 (t2.micro)
```bash
# Swap 파일 생성
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Docker 권한 오류
```bash
sudo usermod -aG docker $USER
newgrp docker
# 또는 재로그인
```

### 3. 포트 접속 불가
- AWS 보안 그룹 인바운드 규칙 확인
- EC2 인스턴스의 방화벽 상태 확인: `sudo ufw status`

## 📞 접속 정보 템플릿

배포 완료 후 아래 정보를 기록하세요:

```
=== AWS EC2 접속 정보 ===
EC2 퍼블릭 IP: [YOUR-EC2-IP]
EC2 퍼블릭 DNS: [YOUR-EC2-DNS]
SSH 접속: ssh -i ~/.ssh/[your-key].pem ubuntu@[EC2-IP]

=== 서비스 URL ===
웹사이트: http://[EC2-IP]
대시보드: http://[EC2-IP]/
포스트 관리: http://[EC2-IP]/posts
예약 발행: http://[EC2-IP]/schedule

=== 관리 명령어 ===
로그 확인: docker-compose logs -f
재시작: docker-compose restart
상태 확인: docker-compose ps
```

## 📝 중요 참고사항

1. **보안**: 프로덕션 환경에서는 반드시 HTTPS를 설정하세요
2. **백업**: 정기적인 데이터 백업 스케줄을 설정하세요
3. **모니터링**: CloudWatch나 다른 모니터링 도구를 설정하세요
4. **환경변수**: 민감한 정보는 AWS Secrets Manager 사용을 권장합니다

---
작성일: 2025년 7월 20일  
프로젝트: ray1derer-auto-blog  
버전: 0.1.0