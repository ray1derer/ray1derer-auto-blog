import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const id = searchParams.get('id')
    
    // 스크린샷 디렉토리 경로
    const screenshotDirs = [
      path.join(process.cwd(), 'public', 'screenshots', 'test'),
      path.join(process.cwd(), 'public', 'screenshots', type)
    ]
    
    if (id) {
      screenshotDirs.push(path.join(process.cwd(), 'public', 'screenshots', type, id))
    }
    
    const screenshots = []
    
    for (const dir of screenshotDirs) {
      try {
        const files = await fs.readdir(dir)
        
        for (const file of files) {
          if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
            const filePath = path.join(dir, file)
            const stats = await fs.stat(filePath)
            
            // URL 생성 (public 폴더 기준)
            const url = filePath.replace(path.join(process.cwd(), 'public'), '')
            
            screenshots.push({
              url,
              filename: file,
              timestamp: stats.mtime.getTime(),
              platform: extractPlatformFromFilename(file)
            })
          }
        }
      } catch (error) {
        // 디렉토리가 없을 수 있음
        console.log(`Directory not found: ${dir}`)
      }
    }
    
    // 최신 순으로 정렬
    screenshots.sort((a, b) => b.timestamp - a.timestamp)
    
    return NextResponse.json({
      success: true,
      screenshots
    })
  } catch (error) {
    console.error('Screenshot list error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load screenshots' },
      { status: 500 }
    )
  }
}

function extractPlatformFromFilename(filename: string): string {
  if (filename.includes('notion')) return 'notion'
  if (filename.includes('cursor')) return 'cursor'
  if (filename.includes('claude')) return 'claude'
  if (filename.includes('obsidian')) return 'obsidian'
  return 'unknown'
}