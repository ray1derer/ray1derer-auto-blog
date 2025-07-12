"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { getClaudeLesson, claudeLessons } from "@/lib/claude-lessons"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit } from "lucide-react"
import Link from "next/link"

export default function ClaudeLessonPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState("")
  
  const lessonId = parseInt(params.id as string)
  const lesson = getClaudeLesson(lessonId)
  
  if (!lesson) {
    notFound()
  }
  
  const prevLesson = claudeLessons.find(l => l.id === lessonId - 1)
  const nextLesson = claudeLessons.find(l => l.id === lessonId + 1)
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/claude-lessons/${lessonId}`)
        const data = await response.json()
        if (data.content) {
          setContent(data.content)
        }
      } catch (error) {
        console.error('Failed to load lesson content:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadContent()
  }, [lessonId])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Link href="/categories/lectures/claude-ai">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              강좌 목록
            </Button>
          </Link>
          
          <Link href={`/categories/lectures/claude-ai/${lesson.id}/edit`}>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              편집
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.description}</p>
      </div>
      
      <div className="mb-8">
        {loading ? (
          <div className="bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              강좌 콘텐츠를 불러오는 중입니다...
            </p>
          </div>
        ) : content ? (
          <div 
            className="lesson-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              콘텐츠를 불러올 수 없습니다.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center border-t pt-8">
        {prevLesson ? (
          <Link href={`/categories/lectures/claude-ai/${prevLesson.id}`}>
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        
        {nextLesson ? (
          <Link href={`/categories/lectures/claude-ai/${nextLesson.id}`}>
            <Button variant="outline">
              {nextLesson.title}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}