import { NextRequest, NextResponse } from 'next/server'
import { PlaywrightTestEnvironment, verifyEnvironment } from '@/lib/playwright/test-environment'

export async function GET() {
  try {
    // 환경 검증
    const envCheck = await verifyEnvironment()
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Environment check completed'
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Environment check failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json()
    
    const testEnv = new PlaywrightTestEnvironment()
    
    if (platform) {
      // 특정 플랫폼 테스트
      await testEnv.setup()
      const result = await testEnv.testPlatform(platform)
      await testEnv.cleanup()
      
      return NextResponse.json({
        success: true,
        result
      })
    } else {
      // 모든 플랫폼 테스트
      const results = await testEnv.runAllTests()
      
      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: results.length,
          passed: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      })
    }
  } catch (error) {
    console.error('Test execution error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test execution failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}