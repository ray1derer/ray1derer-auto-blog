import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getNotionLesson } from '@/lib/notion-lessons'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)
    const lesson = getNotionLesson(lessonId)
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // HTML 파일 경로
    const filePath = path.join(
      process.cwd(),
      'public',
      'notion-lessons',
      lesson.fileName
    )

    try {
      // 파일 읽기 시도
      const content = await fs.readFile(filePath, 'utf-8')
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    } catch (fileError) {
      // 파일이 없는 경우 임시 HTML 반환
      const tempHtml = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${lesson.title}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 20px auto; 
              padding: 0 20px; 
            }
            .notice {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            h1 { color: #2c3e50; margin-bottom: 20px; }
            p { margin-bottom: 1em; }
          </style>
        </head>
        <body>
          <h1>${lesson.id}강. ${lesson.title}</h1>
          <p><strong>${lesson.description}</strong></p>
          
          <div class="notice">
            <p>📌 <strong>알림:</strong> 실제 강좌 콘텐츠를 표시하려면 다음 단계가 필요합니다:</p>
            <ol>
              <li>프로젝트의 <code>public/notion-lessons/</code> 폴더를 생성</li>
              <li>해당 폴더에 HTML 파일들을 복사</li>
              <li>페이지를 새로고침</li>
            </ol>
            <p>현재 찾고 있는 파일: <code>${lesson.fileName}</code></p>
          </div>
          
          <p>이 강좌에서는 다음과 같은 내용을 학습합니다:</p>
          <ul>
            ${lessonId === 1 ? '<li>Notion이 해결하는 문제들</li><li>올인원 워크스페이스의 개념</li><li>Notion의 핵심 기능 소개</li>' : ''}
            ${lessonId === 2 ? '<li>Notion 계정 생성 방법</li><li>데스크톱 앱 설치</li><li>인터페이스 둘러보기</li>' : ''}
            ${lessonId === 3 ? '<li>텍스트 블록 사용법</li><li>이미지 추가하기</li><li>체크리스트 만들기</li>' : ''}
            <li>실습 예제와 팁</li>
          </ul>
        </body>
        </html>
      `
      
      return new NextResponse(tempHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }
  } catch (error) {
    console.error('Error loading lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}