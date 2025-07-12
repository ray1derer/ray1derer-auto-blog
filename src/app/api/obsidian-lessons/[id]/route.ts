import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getObsidianLesson } from '@/lib/obsidian-lessons'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lessonId = parseInt(id)
  const lesson = getObsidianLesson(lessonId)
  
  if (!lesson) {
    return new NextResponse('Lesson not found', { status: 404 })
  }
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'obsidian-lessons', lesson.fileName)
    const content = await fs.readFile(filePath, 'utf8')
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error reading lesson file:', error)
    return new NextResponse('Error loading lesson content', { status: 500 })
  }
}