# Google OAuth 설정 가이드

## Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.

2. 프로젝트 선택: `ray1derer-melody-464116-a2`

3. 왼쪽 메뉴에서 "APIs & Services" > "Credentials" 클릭

4. OAuth 2.0 Client ID 설정에서 다음 Redirect URIs를 추가해야 합니다:
   - `http://localhost:3000/api/auth/callback/google` (개발 환경)
   - 배포 시: `https://your-domain.com/api/auth/callback/google`

## 현재 설정된 정보

- **Client ID**: 928229482694-lvft47ks83g2qr7e8evh13dd92thv8un.apps.googleusercontent.com
- **Project ID**: ray1derer-melody-464116-a2

## 주의사항

1. 현재 redirect_uris가 `http://localhost`로만 설정되어 있어 NextAuth와 호환되지 않습니다.
2. 반드시 `/api/auth/callback/google` 경로를 추가해야 합니다.
3. 프로덕션 배포 시에는 HTTPS URL을 사용해야 합니다.

## 테스트 방법

1. 개발 서버 실행: `npm run dev`
2. http://localhost:3000 접속
3. 로그인 버튼 클릭
4. Google 계정으로 로그인

## 환경 변수

`.env.local` 파일에 다음 환경 변수가 설정되어 있습니다:
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET