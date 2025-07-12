const { execSync } = require('child_process');

console.log('🎭 Playwright 브라우저 설치를 시작합니다...\n');

try {
  // Playwright 브라우저 설치
  console.log('📦 Chromium 브라우저 설치 중...');
  execSync('npx playwright install chromium', { stdio: 'inherit' });
  
  // 시스템 의존성 설치 (필요한 경우)
  console.log('\n📦 시스템 의존성 설치 중...');
  execSync('npx playwright install-deps', { stdio: 'inherit' });
  
  console.log('\n✅ Playwright 설치가 완료되었습니다!');
  console.log('이제 설정 페이지에서 테스트 환경을 검증할 수 있습니다.');
} catch (error) {
  console.error('\n❌ Playwright 설치 중 오류가 발생했습니다:', error.message);
  process.exit(1);
}