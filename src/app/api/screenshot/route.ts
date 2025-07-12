import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url, selector, lessonType, lessonId } = await request.json()
    
    // 여기서는 실제 스크린샷 캡처 대신 placeholder를 반환합니다
    // 실제 구현에서는 Playwright를 사용하여 스크린샷을 캡처합니다
    
    return NextResponse.json({
      success: true,
      message: '스크린샷 캡처 요청이 접수되었습니다.',
      data: {
        url,
        selector,
        lessonType,
        lessonId,
        placeholder: true,
        screenshotUrl: `/screenshots/${lessonType}-${lessonId}.png`
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '스크린샷 캡처에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lessonType = searchParams.get('type')
  const lessonId = searchParams.get('id')
  
  // 저장된 스크린샷 정보를 반환
  return NextResponse.json({
    success: true,
    screenshots: [
      {
        lessonType,
        lessonId,
        url: `/screenshots/${lessonType}-${lessonId}-1.png`,
        caption: '예시 스크린샷 1'
      },
      {
        lessonType,
        lessonId,
        url: `/screenshots/${lessonType}-${lessonId}-2.png`,
        caption: '예시 스크린샷 2'
      }
    ]
  })
}