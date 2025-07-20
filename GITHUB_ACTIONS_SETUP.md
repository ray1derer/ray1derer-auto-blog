# GitHub Actions 자동 배포 설정 가이드

## 🚀 자동 배포 설정 방법

GitHub에 코드를 push하면 자동으로 AWS EC2에 배포됩니다!

### 1. GitHub Repository Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 시크릿을 추가하세요:

#### 필수 시크릿:
- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키
- `EC2_HOST`: `54.180.94.235` (Artisan 서버 IP)
- `EC2_SSH_KEY`: SSH 개인 키 내용 (artisan.pem 파일의 전체 내용)

### 2. SSH 키 등록 방법

1. artisan.pem 파일을 텍스트 에디터로 열기
2. 전체 내용 복사 (-----BEGIN RSA PRIVATE KEY-----부터 -----END RSA PRIVATE KEY-----까지)
3. GitHub Secrets에 `EC2_SSH_KEY`로 저장

### 3. 사용 방법

#### 자동 배포:
```bash
git add .
git commit -m "새 기능 추가"
git push origin main
```

#### 수동 배포:
GitHub Actions 탭 → Deploy to AWS EC2 → Run workflow

### 4. 배포 확인

1. GitHub Actions 탭에서 배포 진행 상황 확인
2. 배포 완료 후 http://54.180.94.235:3000 접속
3. 로그 확인: Actions 실행 결과에서 상세 로그 확인 가능

### 5. 트러블슈팅

#### 배포 실패 시:
- EC2 인스턴스가 실행 중인지 확인
- Docker가 설치되어 있는지 확인
- 포트 3000이 열려있는지 확인

#### 환경 변수 추가:
`.github/workflows/deploy.yml` 파일의 환경 변수 섹션 수정

## 📝 주의사항

- main 브랜치에 push할 때만 자동 배포됨
- 배포는 약 3-5분 소요
- 배포 중에는 서비스가 잠시 중단될 수 있음