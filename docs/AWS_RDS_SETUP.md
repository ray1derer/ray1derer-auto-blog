# AWS RDS PostgreSQL 설정 가이드

## 1. AWS RDS 인스턴스 생성

### RDS 콘솔에서 데이터베이스 생성:

1. **엔진 선택**
   - PostgreSQL 15.x 선택
   - 프리 티어 적용 가능

2. **인스턴스 설정**
   ```
   DB 인스턴스 식별자: ray1derer-blog-db
   마스터 사용자 이름: postgres
   마스터 암호: [안전한 암호 설정]
   ```

3. **인스턴스 클래스**
   - db.t3.micro (프리 티어)
   - 또는 db.t4g.micro (더 나은 성능)

4. **스토리지**
   - 20GB gp3 SSD
   - 자동 스토리지 확장 활성화

5. **연결**
   - VPC: EC2와 동일한 VPC 선택
   - 서브넷 그룹: 새로 생성 또는 기존 사용
   - 퍼블릭 액세스: 아니요 (보안상)
   - VPC 보안 그룹: 새로 생성

6. **데이터베이스 옵션**
   ```
   초기 데이터베이스 이름: ray1derer_blog
   DB 파라미터 그룹: default.postgres15
   ```

## 2. 보안 그룹 설정

### RDS 보안 그룹 인바운드 규칙:
```
타입: PostgreSQL
프로토콜: TCP
포트: 5432
소스: EC2 보안 그룹 ID
```

### EC2 보안 그룹 아웃바운드 규칙:
```
타입: PostgreSQL
프로토콜: TCP
포트: 5432
대상: RDS 보안 그룹 ID
```

## 3. 환경 변수 설정

### EC2에서 환경 변수 파일 생성:
```bash
# EC2에 SSH 접속 후
cd ~/ray1derer-auto-blog
nano .env.production
```

### .env.production 내용:
```env
# RDS PostgreSQL 연결 정보
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@your-rds-endpoint.region.rds.amazonaws.com:5432/ray1derer_blog?schema=public"

# 예시:
# DATABASE_URL="postgresql://postgres:MySecurePass123!@ray1derer-blog-db.c1234567.ap-northeast-2.rds.amazonaws.com:5432/ray1derer_blog?schema=public"

# AWS 설정
AWS_REGION="ap-northeast-2"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# S3 설정 (미디어 저장용)
AWS_S3_BUCKET="ray1derer-blog-media"
AWS_S3_REGION="ap-northeast-2"

# NextAuth 설정
NEXTAUTH_URL="http://3.36.71.187"
NEXTAUTH_SECRET="generate-secure-secret-here"

# 암호화 키
ENCRYPTION_KEY="32-character-secure-encryption-key"
```

## 4. Prisma 마이그레이션

### EC2에서 실행:
```bash
# 패키지 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate deploy

# 초기 데이터 시드 (선택사항)
npx prisma db seed
```

## 5. Docker Compose 업데이트

### docker-compose.yml 수정:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
      - AWS_S3_REGION=${AWS_S3_REGION}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    env_file:
      - .env.production
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
```

## 6. 데이터 마이그레이션

### localStorage 데이터를 RDS로 마이그레이션:
```bash
# 마이그레이션 스크립트 실행
npm run migrate:data
```

### package.json에 스크립트 추가:
```json
{
  "scripts": {
    "migrate:data": "tsx src/scripts/migrate-to-rds.ts"
  }
}
```

## 7. S3 버킷 설정 (미디어 저장용)

### S3 버킷 생성:
1. S3 콘솔에서 버킷 생성
2. 버킷 이름: `ray1derer-blog-media`
3. 리전: ap-northeast-2
4. 퍼블릭 액세스 차단 설정 해제 (이미지 공개 접근용)

### 버킷 정책:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ray1derer-blog-media/*"
    }
  ]
}
```

### CORS 설정:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://3.36.71.187", "https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## 8. 모니터링 설정

### CloudWatch 알람:
1. CPU 사용률 > 80%
2. 스토리지 공간 < 10%
3. 데이터베이스 연결 수 > 80

### 백업 설정:
- 자동 백업: 7일 보관
- 백업 시간: 새벽 3-4시 (KST)
- 스냅샷: 주 1회 수동 생성

## 9. 성능 최적화

### RDS 파라미터 그룹 최적화:
```
shared_buffers = {DBInstanceClassMemory/4}
effective_cache_size = {DBInstanceClassMemory*3/4}
work_mem = 4MB
maintenance_work_mem = 64MB
```

### 인덱스 생성:
```sql
-- Prisma 마이그레이션에 포함됨
CREATE INDEX idx_posts_status_published ON posts(status, published_at);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_author ON posts(author_id);
```

## 10. 문제 해결

### 연결 문제:
```bash
# EC2에서 RDS 연결 테스트
psql -h your-rds-endpoint.amazonaws.com -U postgres -d ray1derer_blog

# 연결 실패 시 확인사항:
# 1. 보안 그룹 규칙
# 2. RDS 엔드포인트 주소
# 3. 데이터베이스 이름
# 4. 사용자 이름/비밀번호
```

### 마이그레이션 문제:
```bash
# Prisma 스키마 동기화
npx prisma db push

# 마이그레이션 상태 확인
npx prisma migrate status
```

## 완료 후 확인

1. **데이터베이스 연결 확인**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **데이터 마이그레이션 확인**
   - 카테고리 목록 확인
   - 포스트 목록 확인
   - 사용자 로그인 테스트

3. **성능 테스트**
   - 페이지 로딩 속도
   - API 응답 시간
   - 동시 사용자 처리

---

이 설정을 완료하면 localStorage 기반에서 AWS RDS PostgreSQL 기반으로 완전히 전환됩니다.