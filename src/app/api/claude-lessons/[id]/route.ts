import { NextResponse } from "next/server"
import { getClaudeLesson } from "@/lib/claude-lessons"
import { readFile } from "fs/promises"
import path from "path"

interface Props {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: Request, { params }: Props) {
  const { id } = await params
  const lessonId = parseInt(id)
  const lesson = getClaudeLesson(lessonId)
  
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'claude-lessons', lesson.fileName)
    const content = await readFile(filePath, 'utf-8')
    
    return NextResponse.json({ 
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content 
    })
  } catch (error) {
    console.error('Error reading lesson file:', error)
    return NextResponse.json({ error: "Failed to load lesson content" }, { status: 500 })
  }
}