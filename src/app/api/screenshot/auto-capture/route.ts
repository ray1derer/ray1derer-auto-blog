import { NextRequest, NextResponse } from 'next/server'
import { generateScreenshotPlan } from '@/lib/screenshot-automation'
import { PlaywrightTestEnvironment } from '@/lib/playwright/test-environment'
import { ContentBasedScreenshotCapture } from '@/lib/playwright/content-based-screenshot'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { lessonType, lessonId, title, content } = await request.json()
    
    if (!content || !title) {
      return NextResponse.json(
        { success: false, error: '강좌 내용이 필요합니다.' },
        { status: 400 }
      )
    }
    
    // 1. AI가 강좌 내용을 분석하여 스크린샷 계획 생성
    const screenshotPlan = await generateScreenshotPlan(content, title)
    
    if (screenshotPlan.length === 0) {
      return NextResponse.json({
        success: true,
        message: '스크린샷이 필요한 단계를 찾을 수 없습니다.',
        screenshots: []
      })
    }
    
    // 2. 스크린샷 디렉토리 생성
    const screenshotDir = path.join(process.cwd(), 'public', 'screenshots', lessonType, String(lessonId))
    await fs.mkdir(screenshotDir, { recursive: true })
    
    // 3. 콘텐츠 기반 스크린샷 캡처
    const screenshots = []
    
    try {
      // lessonType에 따라 다른 캡처 방식 사용
      if (lessonType === 'obsidian') {
        console.log('[Auto Capture] Using ContentBasedScreenshotCapture for Obsidian')
        const captureEngine = new ContentBasedScreenshotCapture()
        await captureEngine.setup()
        
        const result = await captureEngine.captureForObsidian(content, lessonId)
        
        if (result.success) {
          console.log(`[Auto Capture] Successfully captured ${result.screenshots.length} screenshots`)
          screenshots.push(...result.screenshots.map((s, index) => ({
            url: s.url,
            caption: s.description,
            step: index + 1
          })))
        } else {
          console.error('[Auto Capture] ContentBasedScreenshotCapture failed:', result.error)
          throw new Error(result.error || 'Content-based capture failed')
        }
        
        await captureEngine.cleanup()
      } else {
        // 기존 방식 (다른 플랫폼용)
        const testEnv = new PlaywrightTestEnvironment()
        await testEnv.setup()
        
        const result = await testEnv.testPlatform(lessonType === 'notion' ? 'notion' : 
                                                 lessonType === 'cursor-ai' ? 'cursor' : 
                                                 lessonType === 'claude-ai' ? 'claude' : 'notion')
        
        // 캡처된 스크린샷을 적절한 위치로 이동
        for (let i = 0; i < result.screenshots.length && i < screenshotPlan.length; i++) {
          const oldPath = result.screenshots[i]
          const filename = `screenshot-${Date.now()}-${i}.png`
          const newPath = path.join(screenshotDir, filename)
          
          // 파일 복사
          await fs.copyFile(oldPath, newPath)
          
          screenshots.push({
            url: `/screenshots/${lessonType}/${lessonId}/${filename}`,
            caption: screenshotPlan[i].description,
            step: i + 1
          })
        }
        
        await testEnv.cleanup()
      }
    } catch (error) {
      console.error('Screenshot capture error:', error)
      // 오류 발생시 placeholder 사용
      const placeholderScreenshots = screenshotPlan
        .filter(step => step.action === 'screenshot')
        .map((step, index) => ({
          url: `https://via.placeholder.com/800x600/3b82f6/ffffff?text=${encodeURIComponent(step.description)}`,
          caption: step.description,
          step: index + 1
        }))
      
      return NextResponse.json({
        success: true,
        message: `스크린샷 캡처 중 오류가 발생하여 임시 이미지를 사용합니다.`,
        plan: screenshotPlan,
        screenshots: placeholderScreenshots,
        error: error instanceof Error ? error.message : String(error)
      })
    }
    
    return NextResponse.json({
      success: true,
      message: `${screenshots.length}개의 스크린샷이 생성되었습니다.`,
      plan: screenshotPlan,
      screenshots
    })
  } catch (error) {
    console.error('Auto screenshot error:', error)
    return NextResponse.json(
      { success: false, error: '자동 스크린샷 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}