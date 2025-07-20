# Ray1derer Auto Blog - 완전 가이드

## 📋 목차
- [프로젝트 개요](#프로젝트-개요)
- [AWS 서버 정보](#aws-서버-정보)
- [프로젝트 기능](#프로젝트-기능)
- [기술 스택](#기술-스택)
- [서버 접속 방법](#서버-접속-방법)
- [배포 관리](#배포-관리)
- [로컬 개발](#로컬-개발)
- [문제 해결](#문제-해결)

---

## 🚀 프로젝트 개요
Ray1derer Auto Blog는 AI 기반 자동 블로그 시스템으로, 다양한 플랫폼에 콘텐츠를 자동으로 발행하고 관리할 수 있는 통합 블로그 관리 플랫폼입니다.

### 🌐 실제 서비스 URL
```
http://43.203.57.64:3000
```

### 📦 GitHub Repository
```
https://github.com/ray1derer/ray1derer-auto-blog.git
```

---

## 🖥️ AWS 서버 정보

### EC2 인스턴스 정보
| 항목 | 값 |
|------|-----|
| **인스턴스 ID** | i-0978272d24308e91e |
| **인스턴스 유형** | t2.small |
| **퍼블릭 IP** | 43.203.57.64 |
| **리전** | ap-northeast-2 (서울) |
| **AMI** | ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-20250610 |
| **스토리지** | 30GB (gp3) |
| **보안 그룹** | 포트 22(SSH), 80(HTTP), 3000(Node.js) 열림 |

### SSH 키 파일 위치
```
G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem
```

### 서버 사용자 정보
- **사용자명**: ubuntu
- **프로젝트 경로**: /home/ubuntu/blog

---

## 🔑 서버 접속 방법

### 1. SSH 접속 (Windows)
```bash
ssh -i "G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem" ubuntu@43.203.57.64
```

### 2. SSH 접속 (Mac/Linux)
```bash
ssh -i "/path/to/artisan.pem" ubuntu@43.203.57.64
```

### 3. 접속 후 프로젝트 디렉토리로 이동
```bash
cd ~/blog
```

---

## 📊 서버 소프트웨어 정보

### 설치된 소프트웨어
- **OS**: Ubuntu 24.04.2 LTS
- **Node.js**: v20.19.4
- **npm**: v10.8.2
- **PM2**: 최신 버전 (프로세스 매니저)
- **Docker**: v28.3.2
- **nginx**: v1.24.0
- **Git**: v2.43.0

---

## 🚀 배포 관리

### PM2 명령어
```bash
# 상태 확인
pm2 status

# 로그 보기
pm2 logs blog

# 재시작
pm2 restart blog

# 중지
pm2 stop blog

# 시작
pm2 start blog

# 서버 재부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

### 코드 업데이트 방법
```bash
# 서버 접속
ssh -i "G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem" ubuntu@43.203.57.64

# 프로젝트 디렉토리로 이동
cd ~/blog

# 최신 코드 가져오기
git pull origin main

# 의존성 설치
npm install

# PM2로 재시작
pm2 restart blog
```

### 환경 변수 설정
```bash
# .env.local 파일 편집
nano .env.local

# 다음 내용 포함
NEXT_PUBLIC_API_URL=http://43.203.57.64:3000
DATABASE_URL=postgresql://postgres:dbpassword@db:5432/blog
NEXTAUTH_URL=http://43.203.57.64
NEXTAUTH_SECRET=supersecretkey123
```

---

## 💻 로컬 개발

### 1. 프로젝트 클론
```bash
git clone https://github.com/ray1derer/ray1derer-auto-blog.git
cd ray1derer-auto-blog
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Prisma 설정 (데이터베이스 사용 시)
```bash
npm install @prisma/client prisma
npx prisma generate
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저에서 접속
```
http://localhost:3000
```

---

## 🛠️ 프로젝트 기능

### 1. 포스트 관리
- 마크다운 자동 변환
- 실시간 미리보기
- 카테고리 관리 (편집/삭제 가능)
- 태그 시스템

### 2. AI 기능
- AI 자동 스크린샷
- 스크린샷 갤러리
- 이미지 자동 추가

### 3. 강좌 관리
- 노션 강좌: 30개
- 옵시디언 강좌: 35개
- 커서 AI 강좌: 30개
- 클로드 AI 강좌: 40개

### 4. 멀티 플랫폼 발행
- 티스토리, 네이버 블로그, 브런치
- 워드프레스, 미디엄, 벨로그

---

## 🏗️ 프로젝트 구조
```
ray1derer-auto-blog/
├── src/
│   ├── app/               # Next.js 15 앱 라우터
│   ├── components/        # React 컴포넌트
│   └── lib/              # 유틸리티 함수
├── public/               # 정적 파일
│   ├── notion-lessons/   # 노션 강좌 HTML
│   ├── obsidian-lessons/ # 옵시디언 강좌 HTML
│   ├── cursor-lessons/   # 커서 AI 강좌 HTML
│   └── claude-lessons/   # 클로드 AI 강좌 HTML
├── prisma/              # Prisma 스키마
├── .env.local           # 환경 변수
└── package.json         # 프로젝트 설정
```

---

## 🐛 문제 해결

### 서버가 응답하지 않을 때
```bash
# PM2 상태 확인
pm2 status

# 로그 확인
pm2 logs blog --lines 50

# 재시작
pm2 restart blog
```

### 포트 충돌 시
```bash
# 3000번 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 [PID]
```

### nginx 설정 문제
```bash
# nginx 설정 테스트
sudo nginx -t

# nginx 재시작
sudo systemctl restart nginx
```

---

## 🔐 보안 정보

### AWS 계정
- **계정 ID**: 931318540685
- **리전**: ap-northeast-2 (서울)

### 중요 파일 위치
- **SSH 키**: `G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem`
- **로컬 프로젝트**: `C:\Users\RAY1DERER\Documents\github-projects\ray1derer-auto-blog`

---

## 📝 추가 참고 문서
- [AWS 배포 가이드](./AWS_DEPLOYMENT_README.md)
- [EC2 새 인스턴스 가이드](./EC2_새_인스턴스_가이드.md)
- [서버 정보](./SERVER_INFO.md)

---

## 🚀 빠른 시작 가이드

### 새로운 Claude가 이 프로젝트를 이어받을 때:

1. **서버 접속**
   ```bash
   ssh -i "G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem" ubuntu@43.203.57.64
   ```

2. **프로젝트 상태 확인**
   ```bash
   cd ~/blog
   pm2 status
   ```

3. **코드 수정 후 배포**
   ```bash
   git pull origin main
   npm install
   pm2 restart blog
   ```

4. **브라우저에서 확인**
   ```
   http://43.203.57.64:3000
   ```

---

**최종 업데이트**: 2025년 7월 21일
**작성자**: Ray1derer with Claude