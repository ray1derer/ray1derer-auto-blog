import { notFound } from "next/navigation"
import { obsidianLessons, getObsidianLesson } from "@/lib/obsidian-lessons"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit, Upload, Eye } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ObsidianLessonPage({ params }: PageProps) {
  const { id } = await params
  const lessonId = parseInt(id)
  const lesson = getObsidianLesson(lessonId)
  
  if (!lesson) {
    notFound()
  }

  // 이전/다음 강의 찾기
  const prevLesson = lessonId > 1 ? getObsidianLesson(lessonId - 1) : null
  const nextLesson = lessonId < obsidianLessons.length ? getObsidianLesson(lessonId + 1) : null
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Link href="/categories/lectures/obsidian">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              강좌 목록으로
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Link href={`/categories/lectures/obsidian/${lesson.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                편집
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              미리보기
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              발행
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">
          {lesson.id}강. {lesson.title}
        </h1>
        <p className="text-gray-600">{lesson.description}</p>
      </div>

      {/* 강좌 내용 영역 */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="prose max-w-none">
          {/* iframe으로 API를 통해 콘텐츠 표시 */}
          <iframe 
            src={`/api/obsidian-lessons/${lesson.id}`}
            className="w-full h-[800px] border-0"
            title={lesson.title}
          />
        </div>
      </div>

      {/* 이전/다음 네비게이션 */}
      <div className="flex justify-between items-center">
        {prevLesson ? (
          <Link href={`/categories/lectures/obsidian/${prevLesson.id}`}>
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {prevLesson.id}강. {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        
        {nextLesson ? (
          <Link href={`/categories/lectures/obsidian/${nextLesson.id}`}>
            <Button variant="outline">
              {nextLesson.id}강. {nextLesson.title}
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