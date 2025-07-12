import { chromium, Browser, BrowserContext, Page } from 'playwright'
import * as fs from 'fs/promises'
import * as path from 'path'

export interface TestResult {
  platform: string
  success: boolean
  error?: string
  screenshots: string[]
  logs: string[]
}

export class PlaywrightTestEnvironment {
  private browser: Browser | null = null
  private screenshotDir: string
  
  constructor() {
    this.screenshotDir = path.join(process.cwd(), 'public', 'screenshots', 'test')
  }
  
  async setup(): Promise<void> {
    // 스크린샷 디렉토리 생성
    await fs.mkdir(this.screenshotDir, { recursive: true })
    
    // 브라우저 실행
    this.browser = await chromium.launch({
      headless: false, // 개발 중에는 UI 표시
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage'
      ]
    })
  }
  
  async testPlatform(platform: string): Promise<TestResult> {
    const result: TestResult = {
      platform,
      success: false,
      screenshots: [],
      logs: []
    }
    
    let context: BrowserContext | null = null
    let page: Page | null = null
    
    try {
      // 새 브라우저 컨텍스트 생성
      context = await this.browser!.newContext({
        viewport: { width: 1920, height: 1080 },
        locale: 'ko-KR',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      })
      
      page = await context.newPage()
      
      // 콘솔 로그 수집
      page.on('console', msg => {
        result.logs.push(`[${msg.type()}] ${msg.text()}`)
      })
      
      // 네트워크 에러 감지
      page.on('requestfailed', request => {
        result.logs.push(`[Network Error] ${request.url()}: ${request.failure()?.errorText}`)
      })
      
      // 플랫폼별 테스트 실행
      switch (platform) {
        case 'notion':
          await this.testNotion(page, result)
          break
        case 'obsidian':
          await this.testObsidian(page, result)
          break
        case 'cursor':
          await this.testCursor(page, result)
          break
        case 'claude':
          await this.testClaude(page, result)
          break
        default:
          throw new Error(`Unknown platform: ${platform}`)
      }
      
      result.success = true
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error)
      result.logs.push(`[Error] ${result.error}`)
    } finally {
      if (context) await context.close()
    }
    
    return result
  }
  
  private async testNotion(page: Page, result: TestResult): Promise<void> {
    result.logs.push('[Test] Notion 홈페이지 접속 시작')
    
    // Notion 홈페이지 접속
    await page.goto('https://notion.so', { waitUntil: 'networkidle' })
    
    // 스크린샷 캡처
    const screenshotPath = path.join(this.screenshotDir, `notion-home-${Date.now()}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false })
    result.screenshots.push(screenshotPath)
    result.logs.push('[Test] Notion 홈페이지 스크린샷 캡처 완료')
    
    // 로그인 버튼 찾기
    const loginButton = await page.$('text=Log in')
    if (loginButton) {
      result.logs.push('[Test] 로그인 버튼 발견')
      
      // 로그인 페이지 감지 테스트
      const isLoginRequired = await this.detectLoginPage(page, 'notion')
      result.logs.push(`[Test] 로그인 필요 여부: ${isLoginRequired}`)
    }
    
    // 기본 UI 요소 확인
    const hasLogo = await page.$('[aria-label*="Notion"]') !== null
    result.logs.push(`[Test] Notion 로고 존재: ${hasLogo}`)
  }
  
  private async testCursor(page: Page, result: TestResult): Promise<void> {
    result.logs.push('[Test] Cursor 홈페이지 접속 시작')
    
    // Cursor 홈페이지 접속
    await page.goto('https://cursor.sh', { waitUntil: 'networkidle' })
    
    // 스크린샷 캡처
    const screenshotPath = path.join(this.screenshotDir, `cursor-home-${Date.now()}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false })
    result.screenshots.push(screenshotPath)
    result.logs.push('[Test] Cursor 홈페이지 스크린샷 캡처 완료')
    
    // 다운로드 버튼 확인
    const downloadButton = await page.$('text=Download')
    result.logs.push(`[Test] 다운로드 버튼 존재: ${downloadButton !== null}`)
  }
  
  private async testObsidian(page: Page, result: TestResult): Promise<void> {
    result.logs.push('[Test] Obsidian 홈페이지 접속 시작')
    
    // Obsidian 홈페이지 접속
    await page.goto('https://obsidian.md', { waitUntil: 'networkidle' })
    
    // 스크린샷 캡처
    const screenshotPath = path.join(this.screenshotDir, `obsidian-home-${Date.now()}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false })
    result.screenshots.push(screenshotPath)
    result.logs.push('[Test] Obsidian 홈페이지 스크린샷 캡처 완료')
    
    // 다운로드 버튼 확인
    const downloadButton = await page.$('a:has-text("Get Obsidian"), button:has-text("Download")')
    result.logs.push(`[Test] 다운로드 버튼 존재: ${downloadButton !== null}`)
  }
  
  private async testClaude(page: Page, result: TestResult): Promise<void> {
    result.logs.push('[Test] Claude 홈페이지 접속 시작')
    
    // Claude 홈페이지 접속
    await page.goto('https://claude.ai', { waitUntil: 'networkidle' })
    
    // 스크린샷 캡처
    const screenshotPath = path.join(this.screenshotDir, `claude-home-${Date.now()}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false })
    result.screenshots.push(screenshotPath)
    result.logs.push('[Test] Claude 홈페이지 스크린샷 캡처 완료')
    
    // 로그인/시작 버튼 확인
    const hasAuthButton = await page.$('button:has-text("Log in"), button:has-text("Get started")') !== null
    result.logs.push(`[Test] 인증 버튼 존재: ${hasAuthButton}`)
  }
  
  private async detectLoginPage(page: Page, platform: string): Promise<boolean> {
    const loginSelectors = {
      notion: ['input[type="email"]', 'button:has-text("Continue with Google")', 'text=Log in'],
      cursor: ['input[placeholder*="email"]', 'button:has-text("Sign in")'],
      claude: ['button:has-text("Log in")', 'input[name="email"]']
    }
    
    const selectors = loginSelectors[platform as keyof typeof loginSelectors] || []
    
    for (const selector of selectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 3000 })
        if (element) return true
      } catch {}
    }
    
    return false
  }
  
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
  
  async runAllTests(): Promise<TestResult[]> {
    const platforms = ['notion', 'cursor', 'claude']
    const results: TestResult[] = []
    
    await this.setup()
    
    for (const platform of platforms) {
      console.log(`\n=== Testing ${platform} ===`)
      const result = await this.testPlatform(platform)
      results.push(result)
      
      // 결과 출력
      console.log(`Success: ${result.success}`)
      if (result.error) console.log(`Error: ${result.error}`)
      console.log('Logs:')
      result.logs.forEach(log => console.log(`  ${log}`))
      console.log(`Screenshots: ${result.screenshots.length}`)
    }
    
    await this.cleanup()
    
    return results
  }
}

// 환경 검증 함수
export async function verifyEnvironment(): Promise<{
  playwright: boolean
  browsers: { chromium: boolean, firefox: boolean, webkit: boolean }
  permissions: { write: boolean, network: boolean }
}> {
  const result = {
    playwright: false,
    browsers: { chromium: false, firefox: false, webkit: false },
    permissions: { write: false, network: false }
  }
  
  try {
    // Playwright 설치 확인
    const { chromium, firefox, webkit } = await import('playwright')
    result.playwright = true
    
    // 브라우저 실행 가능 여부 확인
    try {
      const browser = await chromium.launch({ headless: true })
      await browser.close()
      result.browsers.chromium = true
    } catch {}
    
    // 파일 쓰기 권한 확인
    try {
      const testPath = path.join(process.cwd(), 'test-write-permission.txt')
      await fs.writeFile(testPath, 'test')
      await fs.unlink(testPath)
      result.permissions.write = true
    } catch {}
    
    // 네트워크 접근 확인
    try {
      const browser = await chromium.launch({ headless: true })
      const page = await browser.newPage()
      await page.goto('https://example.com')
      await browser.close()
      result.permissions.network = true
    } catch {}
  } catch (error) {
    console.error('Environment verification error:', error)
  }
  
  return result
}