import { chromium, Browser, Page } from 'playwright'
import * as path from 'path'
import * as fs from 'fs/promises'

export interface ContentBasedScreenshotResult {
  success: boolean
  screenshots: {
    path: string
    url: string
    description: string
  }[]
  error?: string
}

export class ContentBasedScreenshotCapture {
  private browser: Browser | null = null
  
  async setup(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true, // 프로덕션에서는 headless 사용
      args: ['--disable-blink-features=AutomationControlled']
    })
  }
  
  async captureForObsidian(content: string, lessonId: number): Promise<ContentBasedScreenshotResult> {
    const result: ContentBasedScreenshotResult = {
      success: false,
      screenshots: []
    }
    
    try {
      const page = await this.browser!.newPage()
      const screenshotDir = path.join(process.cwd(), 'public', 'screenshots', 'obsidian', String(lessonId))
      await fs.mkdir(screenshotDir, { recursive: true })
      
      // 콘텐츠 분석하여 필요한 스크린샷 결정
      const screenshotTasks = this.analyzeObsidianContent(content)
      
      for (const task of screenshotTasks) {
        try {
          console.log(`[ContentBased] Navigating to ${task.url}`)
          await page.goto(task.url, { waitUntil: 'networkidle', timeout: 30000 })
          
          // 페이지가 로드될 때까지 잠시 대기
          await page.waitForTimeout(2000)
          
          // 특정 요소가 있으면 대기
          if (task.waitForSelector) {
            await page.waitForSelector(task.waitForSelector, { timeout: 5000 })
          }
          
          // 스크린샷 캡처
          const filename = `obsidian-${task.name}-${Date.now()}.png`
          const screenshotPath = path.join(screenshotDir, filename)
          
          if (task.selector) {
            // 특정 요소만 캡처
            const element = await page.$(task.selector)
            if (element) {
              await element.screenshot({ path: screenshotPath })
            } else {
              console.warn(`[ContentBased] Selector ${task.selector} not found, capturing full page`)
              await page.screenshot({ path: screenshotPath, fullPage: false })
            }
          } else {
            // 전체 페이지 캡처
            await page.screenshot({ 
              path: screenshotPath, 
              fullPage: task.fullPage || false 
            })
          }
          
          console.log(`[ContentBased] Screenshot saved: ${filename}`)
          
          result.screenshots.push({
            path: screenshotPath,
            url: `/screenshots/obsidian/${lessonId}/${filename}`,
            description: task.description
          })
        } catch (error) {
          console.error(`[ContentBased] Failed to capture ${task.name}:`, error)
        }
      }
      
      await page.close()
      result.success = true
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error)
    }
    
    return result
  }
  
  private analyzeObsidianContent(content: string): ScreenshotTask[] {
    const tasks: ScreenshotTask[] = []
    
    // 설치 관련 내용이 있으면
    if (content.includes('설치') || content.includes('다운로드')) {
      tasks.push({
        name: 'download-page',
        url: 'https://obsidian.md/download',
        description: 'Obsidian 다운로드 페이지',
        fullPage: false
      })
    }
    
    // Vault 관련 내용
    if (content.includes('보관함') || content.includes('Vault')) {
      tasks.push({
        name: 'homepage',
        url: 'https://obsidian.md',
        description: 'Obsidian 보관함 기능',
        fullPage: false
      })
    }
    
    // 플러그인 관련 내용
    if (content.includes('플러그인') || content.includes('plugin')) {
      tasks.push({
        name: 'community-plugins',
        url: 'https://obsidian.md/plugins',
        description: 'Obsidian 커뮤니티 플러그인',
        fullPage: false
      })
    }
    
    // 그래프 뷰 관련
    if (content.includes('그래프') || content.includes('graph')) {
      tasks.push({
        name: 'graph-view',
        url: 'https://obsidian.md',
        description: 'Obsidian 그래프 뷰',
        fullPage: false
      })
    }
    
    // 기본 홈페이지 (항상 포함)
    if (tasks.length === 0) {
      tasks.push({
        name: 'homepage',
        url: 'https://obsidian.md',
        description: 'Obsidian 홈페이지',
        fullPage: false
      })
    }
    
    return tasks
  }
  
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

interface ScreenshotTask {
  name: string
  url: string
  description: string
  selector?: string
  waitForSelector?: string
  fullPage?: boolean
}