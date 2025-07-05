# Ray1derer Auto Blog

다중 플랫폼 자동 블로그 포스팅 시스템

## 🚀 프로젝트 소개

Ray1derer Auto Blog는 여러 블로그 플랫폼에 동시에 포스트를 발행할 수 있는 자동화 시스템입니다.

### 주요 기능

- 📝 **포스트 관리**: 마크다운 에디터와 이미지 관리
- 📁 **카테고리 관리**: 계층적 카테고리 구조
- 📅 **예약 발행**: 자동 예약 발행 시스템
- 🔗 **플랫폼 연동**: 네이버, 워드프레스, 티스토리 등
- 📸 **인스타그램**: 이미지 편집 및 업로드
- 🤖 **AI 도우미**: Claude AI 글쓰기 보조

## 🛠 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI**: Shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM (예정)

## 🏃‍♂️ 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📂 프로젝트 구조

```
src/
├── app/
│   ├── (dashboard)/    # 대시보드 페이지들
│   └── api/           # API 라우트 (예정)
├── components/        # 재사용 가능한 컴포넌트
└── lib/              # 유틸리티 함수
```

## 🔜 개발 예정

- [ ] 데이터베이스 연동
- [ ] 인증 시스템
- [ ] 포스트 CRUD
- [ ] 플랫폼 API 연동
- [ ] 예약 발행 시스템

## 📄 라이선스

MIT License
