# GitHub Actions 자동 배포 설정 가이드

## 개요
이 가이드는 GitHub에 코드를 푸시하면 자동으로 AWS EC2 서버에 배포하는 방법을 설명합니다.

## GitHub Secrets 설정

GitHub 저장소에서 다음 Secret들을 설정해야 합니다:

1. **저장소 페이지에서 Settings 탭 클릭**
2. **왼쪽 메뉴에서 Secrets and variables > Actions 클릭**
3. **New repository secret 버튼 클릭**
4. **다음 Secret들을 추가:**

### 필수 Secrets

#### 1. `EC2_HOST`
- **값**: `43.203.57.64`
- **설명**: EC2 인스턴스의 퍼블릭 IP 주소

#### 2. `EC2_SSH_KEY`
- **값**: artisan.pem 파일의 전체 내용
- **가져오는 방법**:
  ```bash
  # Windows PowerShell에서:
  Get-Content "G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem" -Raw
  
  # 또는 메모장으로 열어서 전체 내용 복사
  ```
- **주의**: -----BEGIN RSA PRIVATE KEY-----부터 -----END RSA PRIVATE KEY-----까지 전체 내용을 포함해야 함

#### 3. `AWS_ACCESS_KEY_ID` (선택사항)
- **값**: AWS IAM 사용자의 Access Key ID
- **설명**: AWS 서비스 접근용 (현재 워크플로우에서는 사용하지 않음)

#### 4. `AWS_SECRET_ACCESS_KEY` (선택사항)
- **값**: AWS IAM 사용자의 Secret Access Key
- **설명**: AWS 서비스 접근용 (현재 워크플로우에서는 사용하지 않음)

## 사용 방법

1. 코드 변경 후 커밋:
   ```bash
   git add .
   git commit -m "feat: 새 기능 추가"
   ```

2. main 브랜치에 푸시:
   ```bash
   git push origin main
   ```

3. GitHub Actions가 자동으로 실행되어 서버에 배포됩니다.

4. Actions 탭에서 배포 진행 상황을 확인할 수 있습니다.

## 워크플로우 동작 과정

1. main 브랜치에 푸시 감지
2. Ubuntu 환경에서 워크플로우 실행
3. SSH를 통해 EC2 서버 접속
4. 최신 코드 풀 (git pull)
5. 의존성 설치 (npm install)
6. 프로덕션 빌드 (npm run build)
7. PM2로 애플리케이션 재시작
8. 헬스 체크로 배포 성공 확인

## 문제 해결

### SSH 연결 실패
- EC2 보안 그룹에서 22번 포트가 열려있는지 확인
- EC2 인스턴스가 실행 중인지 확인
- SSH 키가 올바르게 설정되었는지 확인

### 배포 실패
- EC2 서버에 충분한 디스크 공간이 있는지 확인
- Node.js와 PM2가 설치되어 있는지 확인
- git 저장소가 올바르게 설정되어 있는지 확인

## 수동 배포 방법

GitHub Actions를 사용하지 않고 수동으로 배포하려면:

```bash
# 서버 접속
ssh -i "G:\내 드라이브\CLADE PROJECT\KEY\artisan.pem" ubuntu@43.203.57.64

# 프로젝트 디렉토리로 이동
cd ~/blog

# 최신 코드 가져오기
git pull origin main

# 의존성 설치
npm install

# 빌드
npm run build

# PM2 재시작
pm2 restart blog
```