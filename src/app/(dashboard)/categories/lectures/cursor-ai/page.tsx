"use client"

import { useState } from "react"
import { cursorLessons } from "@/lib/cursor-lessons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function CursorLessonsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  
  const filteredLessons = cursorLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSchedule = (lessonId: number) => {
    setSelectedLesson(lessonId)
    setShowScheduleModal(true)
    const today = new Date().toISOString().split('T')[0]
    setScheduleDate(today)
    setScheduleTime('10:00')
  }

  const handleConfirmSchedule = async () => {
    if (selectedPlatforms.length === 0) {
      alert('발행할 플랫폼을 선택해주세요.')
      return
    }
    
    // 연동된 플랫폼 확인
    const { getPlatformConnections } = await import('@/lib/storage')
    const connectedPlatforms = getPlatformConnections()
    const connectedPlatformNames = connectedPlatforms
      .filter(p => p.status === 'connected')
      .map(p => p.name)
    
    if (connectedPlatformNames.length === 0) {
      alert('연동된 플랫폼이 없습니다.\n\n플랫폼 연동 페이지에서 먼저 플랫폼을 연동해주세요.')
      return
    }
    
    const notConnectedPlatforms = selectedPlatforms.filter(
      platform => !connectedPlatformNames.includes(platform)
    )
    
    if (notConnectedPlatforms.length > 0) {
      alert(`다음 플랫폼이 연동되지 않았습니다: ${notConnectedPlatforms.join(', ')}\n\n플랫폼 연동 페이지에서 먼저 연동해주세요.`)
      return
    }
    
    // 예약 발행 정보 저장
    const { saveScheduledPost } = await import('@/lib/storage')
    const lesson = cursorLessons.find(l => l.id === selectedLesson)
    
    if (lesson) {
      const scheduledPost = {
        id: Date.now().toString() + '_scheduled',
        postId: lesson.id.toString(),
        title: lesson.title,
        date: scheduleDate,
        time: scheduleTime,
        platforms: selectedPlatforms,
        status: 'pending' as const
      }
      
      saveScheduledPost(scheduledPost)
      alert(`"${lesson.title}"이(가) ${scheduleDate} ${scheduleTime}에 발행 예약되었습니다.`)
    }
    
    setShowScheduleModal(false)
    setSelectedLesson(null)
    setSelectedPlatforms([])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cursor AI 강좌</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          총 {cursorLessons.length}개 강좌
        </Badge>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="강좌 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {lesson.description}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {lesson.id}강
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link href={`/categories/lectures/cursor-ai/${lesson.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    보기
                  </Button>
                </Link>
                <Link href={`/categories/lectures/cursor-ai/${lesson.id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    편집
                  </Button>
                </Link>
                <Button size="sm" onClick={() => handleSchedule(lesson.id)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  예약 발행
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 예약 발행 모달 */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>예약 발행 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">발행 날짜</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">발행 시간</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label>발행할 플랫폼</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['티스토리', '네이버', '브런치', '미디엄'].map((platform) => (
                      <div key={platform} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={platform}
                          checked={selectedPlatforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform])
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={platform} className="cursor-pointer">
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleConfirmSchedule}>
                    예약하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}