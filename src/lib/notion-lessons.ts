export interface NotionLesson {
  id: number
  title: string
  description: string
  fileName: string
}

export const notionLessons: NotionLesson[] = [
  {
    id: 1,
    title: "나의 첫 페이지 - 인터페이스와 블록 개념",
    description: "노션은 단순한 메모 앱이 아닙니다.",
    fileName: "lesson01.html"
  },
  {
    id: 2,
    title: "기본 블록 마스터하기 - 생각의 구조화",
    description: "노션의 모든 콘텐츠는 '블록'으로 이루어져 있습니다.",
    fileName: "lesson02.html"
  },
  {
    id: 3,
    title: "페이지 운영 - 중첩, 연결, 공유",
    description: "노션은 단순히 페이지를 만드는 것을 넘어, 페이지들을 서로 연결하고 계층적으로 구성하며, 필요에 따라 다른 사람들과 공유할 수 있는 강력한 기능을 제공합니다.",
    fileName: "lesson03.html"
  },
  {
    id: 4,
    title: "강조의 기술 - 서식, 색상, 콜아웃",
    description: "노션은 텍스트의 의미를 명확히 하고 중요한 정보를 시각적으로 강조할 수 있는 다양한 서식 및 디자인 기능을 제공합니다.",
    fileName: "lesson04.html"
  },
  {
    id: 5,
    title: "필수 단축키와 마크다운 완전 정복",
    description: "노션은 마우스 사용을 최소화하고 키보드만으로도 빠르고 효율적으로 작업할 수 있도록 다양한 단축키와 마크다운 문법을 지원합니다.",
    fileName: "lesson05.html"
  },
  {
    id: 6,
    title: "모듈 1 복습 및 미니 프로젝트",
    description: "모듈 1에서는 노션의 가장 기본적인 구성 요소와 페이지 운영 방법을 배웠습니다.",
    fileName: "lesson06.html"
  },
  {
    id: 7,
    title: "시각적 레이아웃 만들기 - 다단과 구분선",
    description: "노션은 단순히 텍스트를 나열하는 것을 넘어, 정보를 시각적으로 구조화하고 배치할 수 있는 강력한 레이아웃 기능을 제공합니다.",
    fileName: "lesson07.html"
  },
  {
    id: 8,
    title: "페이지에 생명 불어넣기 - 아이콘, 커버, 미디어",
    description: "노션 페이지는 단순한 문서가 아니라 시각적으로 매력적인 대시보드나 웹사이트처럼 꾸밀 수 있습니다.",
    fileName: "lesson08.html"
  },
  {
    id: 9,
    title: "결정적 전환 - 데이터베이스 입문",
    description: "노션의 진정한 힘은 '데이터베이스'에서 나옵니다.",
    fileName: "lesson09.html"
  },
  {
    id: 10,
    title: "데이터베이스 보기 둘러보기 - 데이터 시각화",
    description: "노션 데이터베이스의 강력함은 동일한 데이터를 다양한 방식으로 시각화하여 보여주는 '보기(View)' 기능에서 나옵니다.",
    fileName: "lesson10.html"
  },
  {
    id: 11,
    title: "고급 블록 활용 - 버튼, 동기화 블록, 목차",
    description: "노션은 단순한 텍스트 블록을 넘어, 워크플로우를 자동화하고 콘텐츠를 효율적으로 관리할 수 있는 고급 블록들을 제공합니다.",
    fileName: "lesson11.html"
  },
  {
    id: 12,
    title: "모듈 2 복습 및 미니 프로젝트",
    description: "모듈 2에서는 노션 페이지를 시각적으로 디자인하고 구조화하는 방법을 배웠습니다.",
    fileName: "lesson12.html"
  },
  {
    id: 13,
    title: "데이터베이스 속성 심층 분석",
    description: "노션 데이터베이스의 각 열은 '속성(Property)'이라고 불리며, 이 속성들은 데이터베이스에 저장되는 정보의 유형을 정의합니다.",
    fileName: "lesson13.html"
  },
  {
    id: 14,
    title: "보기 마스터하기 - 필터, 정렬, 그룹",
    description: "노션 데이터베이스의 '보기(View)'는 단순히 데이터를 시각화하는 것을 넘어, 특정 조건에 맞는 데이터만 보여주거나, 원하는 순서로 정렬하고, 특정 속성을 기준으로 분류하여 보여주는 강력한 기능을 제공합니다.",
    fileName: "lesson14.html"
  },
  {
    id: 15,
    title: "세상을 연결하다 - 관계형 속성",
    description: "노션 데이터베이스의 진정한 힘은 서로 다른 데이터베이스를 연결하는 '관계형(Relation)' 속성에서 나옵니다.",
    fileName: "lesson15.html"
  },
  {
    id: 16,
    title: "데이터 집계하기 - 롤업 속성",
    description: "관계형 속성을 통해 데이터베이스를 연결했다면, 이제 연결된 데이터베이스의 정보를 가져와 요약하고 계산할 수 있습니다.",
    fileName: "lesson16.html"
  },
  {
    id: 17,
    title: "워크플로우 자동화 - 데이터베이스 템플릿",
    description: "반복적인 작업을 줄이고 일관된 데이터 입력을 위해 노션 데이터베이스 템플릿을 활용하는 방법을 배웁니다.",
    fileName: "lesson17.html"
  },
  {
    id: 18,
    title: "모듈 3 복습 및 미니 프로젝트",
    description: "모듈 3에서는 노션 데이터베이스의 핵심 기능인 속성, 보기, 관계형, 롤업, 템플릿을 심층적으로 다루었습니다.",
    fileName: "lesson18.html"
  },
  {
    id: 19,
    title: "Notion Formula 2.0 입문",
    description: "노션의 '수식(Formula)' 속성은 데이터베이스 내의 다른 속성 값을 기반으로 계산된 값을 표시할 수 있게 해주는 강력한 기능입니다.",
    fileName: "lesson19.html"
  },
  {
    id: 20,
    title: "필수 수식 함수와 논리",
    description: "Notion Formula 2.",
    fileName: "lesson20.html"
  },
  {
    id: 21,
    title: "let, map, filter를 활용한 고급 수식",
    description: "Notion Formula 2.",
    fileName: "lesson21.html"
  },
  {
    id: 22,
    title: "노션 자동화 입문",
    description: "노션은 단순한 문서 및 데이터베이스 도구를 넘어, 반복적인 작업을 자동화하여 생산성을 크게 향상시킬 수 있는 기능을 제공합니다.",
    fileName: "lesson22.html"
  },
  {
    id: 23,
    title: "API, Zapier, Make.com으로 노션 확장하기",
    description: "노션의 네이티브 자동화 기능만으로는 부족할 때, 외부 서비스와의 연동을 통해 노션의 기능을 무한히 확장할 수 있습니다.",
    fileName: "lesson23.html"
  },
  {
    id: 24,
    title: "모듈 4 복습 및 미니 프로젝트",
    description: "모듈 4에서는 Notion Formula 2.",
    fileName: "lesson24.html"
  },
  {
    id: 25,
    title: "25강 & 26강: 최종 프로젝트 1 - PARA 메소드로 '세컨드 브레인' 구축하기 (2부작)",
    description: "이 최종 프로젝트는 노션의 모든 기능을 통합하여 개인의 삶과 업무를 총체적으로 관리하는 '라이프 운영체제(Life Operating System)'를 구축하는 데 중점을 둡니다.",
    fileName: "lesson25-26.html"
  },
  {
    id: 26,
    title: "27강 & 28강: 최종 프로젝트 2 - GTD로 생산성 마스터하기 (2부작)",
    description: "GTD(Getting Things Done)는 David Allen이 개발한 세계적으로 유명한 생산성 방법론입니다.",
    fileName: "lesson27-28.html"
  },
  {
    id: 27,
    title: "노션 AI 활용하기",
    description: "노션 AI는 인공지능의 힘을 빌려 콘텐츠 생성, 요약, 번역 등 다양한 작업을 자동화하고 생산성을 높일 수 있는 혁신적인 기능입니다.",
    fileName: "lesson29.html"
  },
  {
    id: 28,
    title: "협업 - 팀 위키 구축하기",
    description: "노션은 개인의 생산성 도구를 넘어, 팀과 조직의 협업을 위한 강력한 플랫폼으로 활용될 수 있습니다.",
    fileName: "lesson30.html"
  }
]

export function getNotionLesson(id: number): NotionLesson | undefined {
  return notionLessons.find(lesson => lesson.id === id)
}

export function getNotionLessonContent(fileName: string): string {
  // 실제 구현에서는 파일을 읽어서 반환
  // 임시로 경로만 반환
  return `/notion-lessons/${fileName}`
}
