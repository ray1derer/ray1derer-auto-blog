// import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright"

export interface ScreenshotStep {
  action: 'navigate' | 'click' | 'type' | 'screenshot' | 'wait'
  selector?: string
  value?: string
  description: string
  waitTime?: number
}

export interface LessonScreenshotPlan {
  lessonId: number
  lessonType: string
  title: string
  steps: ScreenshotStep[]
}

// AI가 강좌 내용을 분석하여 스크린샷 계획을 생성
export async function generateScreenshotPlan(
  lessonContent: string,
  lessonTitle: string
): Promise<ScreenshotStep[]> {
  const steps: ScreenshotStep[] = []
  
  // HTML 태그 제거하여 순수 텍스트만 분석
  const plainText = lessonContent.replace(/<[^>]*>/g, ' ').toLowerCase()
  const titleLower = lessonTitle.toLowerCase()
  
  // 노션 관련 강좌
  if (titleLower.includes("노션") || titleLower.includes("notion")) {
    steps.push(
      { action: 'navigate', value: 'https://notion.so', description: '노션 홈페이지' },
      { action: 'wait', waitTime: 2000, description: '페이지 로딩 대기' },
      { action: 'screenshot', description: '노션 메인 화면' }
    )
    
    // 가입/회원가입 관련
    if (plainText.includes("가입") || plainText.includes("sign up") || plainText.includes("회원가입")) {
      steps.push(
        { action: 'click', selector: '[data-test="signup"]', description: '가입 버튼 클릭' },
        { action: 'wait', waitTime: 1000, description: '대기' },
        { action: 'screenshot', description: '회원가입 옵션 화면' }
      )
    }
    
    // 워크스페이스 관련
    if (plainText.includes("워크스페이스") || plainText.includes("workspace")) {
      steps.push(
        { action: 'screenshot', description: '워크스페이스 설정 화면' }
      )
    }
    
    // 페이지 생성 관련
    if (plainText.includes("새 페이지") || plainText.includes("new page") || plainText.includes("페이지 만들기")) {
      steps.push(
        { action: 'click', selector: 'button:has-text("New page")', description: '새 페이지 버튼' },
        { action: 'wait', waitTime: 1000, description: '대기' },
        { action: 'screenshot', description: '새 페이지 생성 화면' }
      )
    }
    
    // 블록 관련
    if (plainText.includes("블록") || plainText.includes("block")) {
      steps.push(
        { action: 'screenshot', description: '블록 추가 메뉴' }
      )
    }
    
    // 캘린더 관련
    if (plainText.includes("캘린더") || plainText.includes("calendar") || plainText.includes("일정")) {
      steps.push(
        { action: 'screenshot', description: '캘린더 블록 추가' },
        { action: 'screenshot', description: '캘린더 설정 화면' }
      )
    }
  }
  
  // Cursor 관련 강좌
  else if (titleLower.includes("cursor")) {
    steps.push(
      { action: 'navigate', value: 'https://cursor.sh', description: 'Cursor 홈페이지' },
      { action: 'wait', waitTime: 2000, description: '페이지 로딩 대기' },
      { action: 'screenshot', description: 'Cursor 메인 화면' }
    )
    
    if (plainText.includes("설치") || plainText.includes("install") || plainText.includes("다운로드")) {
      steps.push(
        { action: 'screenshot', description: 'Cursor 다운로드 화면' }
      )
    }
  }
  
  // Claude 관련 강좌
  else if (titleLower.includes("claude")) {
    steps.push(
      { action: 'navigate', value: 'https://claude.ai', description: 'Claude 홈페이지' },
      { action: 'wait', waitTime: 2000, description: '페이지 로딩 대기' },
      { action: 'screenshot', description: 'Claude 메인 화면' }
    )
    
    if (plainText.includes("대화") || plainText.includes("chat") || plainText.includes("질문")) {
      steps.push(
        { action: 'screenshot', description: 'Claude 대화 인터페이스' }
      )
    }
  }
  
  // 스크린샷이 하나도 없으면 기본 스크린샷 추가
  if (steps.filter(s => s.action === 'screenshot').length === 0) {
    steps.push(
      { action: 'screenshot', description: '메인 화면' }
    )
  }
  
  return steps
}

// Playwright를 사용하여 실제 스크린샷 캡처
export async function executeScreenshotPlan(
  steps: ScreenshotStep[],
  outputDir: string
): Promise<string[]> {
  const screenshots: string[] = []
  
  // 여기서는 placeholder를 반환합니다.
  // 실제 구현에서는 Playwright를 사용하여 브라우저를 제어하고 스크린샷을 캡처해야 합니다.
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    if (step.action === 'screenshot') {
      const screenshotPath = `${outputDir}/screenshot-${i + 1}.png`
      screenshots.push(screenshotPath)
    }
  }
  
  return screenshots
}

// 강좌 내용에서 실행 가능한 명령어나 액션 추출
export function extractActionsFromContent(content: string): string[] {
  const actions: string[] = []
  
  // 일반적인 패턴 매칭
  const patterns = [
    /클릭\s*[하해]\s*[주세]\s*요?/g,
    /입력\s*[하해]\s*[주세]\s*요?/g,
    /선택\s*[하해]\s*[주세]\s*요?/g,
    /누르\s*[세십]\s*시\s*오?/g,
    /생성\s*[하해]\s*[주세]\s*요?/g,
    /만들\s*[어기]\s*[주세]\s*요?/g,
  ]
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      actions.push(...matches)
    }
  })
  
  return actions
}