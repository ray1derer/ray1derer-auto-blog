import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getClaudeLesson, claudeLessons } from "@/lib/claude-lessons"
import { generateMetadata as generateSEOMetadata, generateJsonLd } from "@/components/seo/metadata"
import ClaudeLessonClient from "./claude-lesson-client"
import Script from "next/script"

interface LessonPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const lessonId = parseInt(params.id)
  const lesson = getClaudeLesson(lessonId)

  if (!lesson) {
    return {
      title: "강의를 찾을 수 없습니다",
    }
  }

  return generateSEOMetadata({
    title: lesson.title,
    description: lesson.description || `Claude AI 강의 ${lesson.id}강: ${lesson.title} - AI 도구 활용법을 배워보세요`,
    keywords: ['Claude AI', 'AI 강의', lesson.title, 'AI 활용', '인공지능 교육'],
    type: 'article',
    url: `/categories/lectures/claude-ai/${lesson.id}`,
    publishedTime: new Date().toISOString(),
    section: 'Claude AI 강의',
  })
}

export default function ClaudeLessonPage({ params }: LessonPageProps) {
  const lessonId = parseInt(params.id)
  const lesson = getClaudeLesson(lessonId)

  if (!lesson) {
    notFound()
  }

  const prevLesson = claudeLessons.find(l => l.id === lessonId - 1)
  const nextLesson = claudeLessons.find(l => l.id === lessonId + 1)

  const jsonLd = generateJsonLd({
    title: lesson.title,
    description: lesson.description || `Claude AI 강의 ${lesson.id}강: ${lesson.title}`,
    author: 'Ray1derer',
    url: `/categories/lectures/claude-ai/${lesson.id}`,
    publishedTime: new Date().toISOString(),
    type: 'article',
    keywords: ['Claude AI', 'AI 강의', lesson.title],
  })

  return (
    <>
      <Script
        id={`json-ld-claude-${lesson.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      <ClaudeLessonClient 
        lesson={lesson} 
        lessonId={lessonId}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </>
  )
}