import { chromium, Browser, Page } from 'playwright'
import { ScreenshotStep } from './screenshot-automation'
import fs from 'fs/promises'
import path from 'path'

export class ScreenshotCapture {
  private browser: Browser | null = null
  private page: Page | null = null

  async initialize() {
    this.browser = await chromium.launch({
      headless: false, // 사용자가 볼 수 있도록 브라우저를 표시
      slowMo: 500, // 액션을 천천히 수행하여 사용자가 볼 수 있게 함
    })
    
    const context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    
    this.page = await context.newPage()
  }

  async executeSteps(steps: ScreenshotStep[], outputDir: string): Promise<string[]> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    const screenshots: string[] = []
    await fs.mkdir(outputDir, { recursive: true })

    let screenshotIndex = 0

    for (const step of steps) {
      try {
        switch (step.action) {
          case 'navigate':
            if (step.value) {
              await this.page.goto(step.value, { waitUntil: 'networkidle' })
            }
            break

          case 'click':
            if (step.selector) {
              await this.page.click(step.selector)
            }
            break

          case 'type':
            if (step.selector && step.value) {
              await this.page.type(step.selector, step.value)
            }
            break

          case 'wait':
            await this.page.waitForTimeout(step.waitTime || 1000)
            break

          case 'screenshot':
            screenshotIndex++
            const screenshotPath = path.join(outputDir, `screenshot-${screenshotIndex}.png`)
            await this.page.screenshot({ 
              path: screenshotPath,
              fullPage: false 
            })
            screenshots.push(screenshotPath)
            break
        }
      } catch (error) {
        console.error(`Error executing step: ${step.description}`, error)
        // 에러가 발생해도 계속 진행
      }
    }

    return screenshots
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  // 로그인이 필요한 경우 사용자에게 알림
  async checkLoginRequired(): Promise<boolean> {
    if (!this.page) return false

    // 일반적인 로그인 관련 텍스트 검색
    const loginIndicators = [
      'login', 'sign in', 'log in', '로그인', 
      'password', '비밀번호', 'signin'
    ]

    for (const indicator of loginIndicators) {
      const element = await this.page.locator(`text=/${indicator}/i`).first()
      if (await element.isVisible().catch(() => false)) {
        return true
      }
    }

    return false
  }
}

// AI가 생성한 계획을 실행하는 메인 함수
export async function captureScreenshotsWithPlaywright(
  steps: ScreenshotStep[],
  outputDir: string,
  onLoginRequired?: () => void
): Promise<{ success: boolean; screenshots: string[]; error?: string }> {
  const capture = new ScreenshotCapture()
  
  try {
    await capture.initialize()
    
    // 첫 번째 navigate 이후 로그인 필요 여부 확인
    const firstNavigate = steps.find(s => s.action === 'navigate')
    if (firstNavigate) {
      const navigateIndex = steps.indexOf(firstNavigate)
      await capture.executeSteps([firstNavigate], outputDir)
      
      if (await capture.checkLoginRequired()) {
        if (onLoginRequired) {
          onLoginRequired()
        }
        
        // 사용자가 로그인할 시간을 줌 (30초)
        await new Promise(resolve => setTimeout(resolve, 30000))
      }
      
      // 나머지 단계 실행
      const remainingSteps = steps.slice(navigateIndex + 1)
      const screenshots = await capture.executeSteps(remainingSteps, outputDir)
      
      return { success: true, screenshots }
    }
    
    const screenshots = await capture.executeSteps(steps, outputDir)
    return { success: true, screenshots }
    
  } catch (error) {
    console.error('Screenshot capture error:', error)
    return { 
      success: false, 
      screenshots: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  } finally {
    await capture.cleanup()
  }
}