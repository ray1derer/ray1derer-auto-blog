"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { getNotionLesson } from "@/lib/notion-lessons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Save, Image, Eye, Calendar, Clock, Sparkles, ImagePlus } from "lucide-react"
import Link from "next/link"
import { ScreenshotGallery } from "@/components/screenshot-gallery"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function NotionLessonEditPage({ params }: PageProps) {
  const [lessonId, setLessonId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [showHtmlEditor, setShowHtmlEditor] = useState(true)

  useEffect(() => {
    async function loadLesson() {
      const { id } = await params
      const parsedId = parseInt(id)
      setLessonId(parsedId)
      
      const lesson = getNotionLesson(parsedId)
      if (!lesson) {
        notFound()
      }
      
      setTitle(lesson.title)
      setDescription(lesson.description)
      
      // HTML 콘텐츠 로드
      try {
        const response = await fetch(`/api/notion-lessons/${parsedId}`)
        if (response.ok) {
          const html = await response.text()
          console.log('Loaded HTML content:', html.substring(0, 200) + '...')
          setContent(html)
        } else {
          console.error('Failed to load content, status:', response.status)
          // 기본 콘텐츠 설정
          setContent(`<h1>${lesson.title}</h1><p>${lesson.description}</p>`)
        }
      } catch (error) {
        console.error('Failed to load content:', error)
        setContent(`<h1>${lesson.title}</h1><p>${lesson.description}</p>`)
      }
      
      setIsLoading(false)
    }
    
    loadLesson()
  }, [params])

  const handleSave = () => {
    // 저장 로직 구현
    console.log('Saving...', { title, description, content })
    alert('저장되었습니다!')
  }

  const handleImageUpload = () => {
    // 이미지 업로드 로직
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('Uploading image:', file.name)
        // 실제 업로드 로직 구현
      }
    }
    input.click()
  }

  const handleAutoScreenshot = async () => {
    if (!content || !title) {
      alert('강좌 내용을 먼저 작성해주세요.')
      return
    }

    try {
      const response = await fetch('/api/screenshot/auto-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonType: 'notion',
          lessonId,
          title,
          content,
        }),
      })

      const data = await response.json()

      if (data.success && data.screenshots.length > 0) {
        // 생성된 스크린샷들을 콘텐츠에 추가
        let updatedContent = content
        data.screenshots.forEach((screenshot: any) => {
          updatedContent += `\n\n<figure>\n  <img src="${screenshot.url}" alt="${screenshot.caption}" />\n  <figcaption>${screenshot.caption}</figcaption>\n</figure>`
        })
        setContent(updatedContent)
        alert(`${data.screenshots.length}개의 스크린샷이 자동으로 생성되었습니다!`)
      } else {
        alert(data.message || '스크린샷을 생성할 수 없습니다.')
      }
    } catch (error) {
      console.error('Auto screenshot error:', error)
      alert('자동 스크린샷 생성 중 오류가 발생했습니다.')
    }
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/categories/lectures/notion/${lessonId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Link href={`/categories/lectures/notion/${lessonId}`}>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                미리보기
              </Button>
            </Link>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">강좌 편집</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="강좌 제목을 입력하세요"
              />
            </div>
            
            <div>
              <Label htmlFor="description">설명</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="강좌 설명을 입력하세요"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>콘텐츠 편집</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleAutoScreenshot} size="sm" variant="default">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI 자동 스크린샷
                </Button>
                <Button onClick={() => setShowGallery(true)} size="sm" variant="outline">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  스크린샷 갤러리
                </Button>
                <Button onClick={handleImageUpload} size="sm" variant="outline">
                  <Image className="mr-2 h-4 w-4" />
                  이미지 추가
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={showHtmlEditor ? "grid grid-cols-2 gap-4" : ""}>
              {showHtmlEditor && (
                <div>
                  <h3 className="font-semibold mb-2">HTML 편집기</h3>
                  <textarea
                    className="w-full h-[600px] p-4 border rounded-lg font-mono text-sm resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="HTML 콘텐츠를 입력하세요..."
                  />
                </div>
              )}
              
              <div className={showHtmlEditor ? "" : "w-full"}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">실시간 미리보기</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHtmlEditor(!showHtmlEditor)}
                  >
                    {showHtmlEditor ? "에디터 숨기기" : "에디터 표시"}
                  </Button>
                </div>
                <div className="border rounded-lg bg-white h-[600px] overflow-hidden">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            max-width: 800px; 
                            margin: 20px auto; 
                            padding: 0 20px; 
                          }
                          h1, h2, h3, h4 { color: #2c3e50; }
                          h1 { font-size: 2.5em; }
                          h2 { font-size: 1.8em; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                          h3 { font-size: 1.4em; }
                          p { margin-bottom: 1em; }
                          ul, ol { margin-left: 20px; margin-bottom: 1em; }
                          strong { color: #e74c3c; }
                          .example-box { background-color: #ecf0f1; border-left: 5px solid #3498db; padding: 15px; margin: 20px 0; }
                          .term-explanation { background-color: #fdf6e3; border-left: 5px solid #f39c12; padding: 10px; margin: 15px 0; }
                          code { background-color: #eee; padding: 2px 4px; border-radius: 3px; }
                          img { max-width: 100%; height: auto; }
                        </style>
                      </head>
                      <body>
                        ${content}
                      </body>
                      </html>
                    `}
                    className="w-full h-full border-0"
                    title="미리보기"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>발행 설정</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={async () => {
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
                    
                    const notConnectedPlatforms = selectedPlatforms.filter(
                      platform => !connectedPlatformNames.includes(platform)
                    )
                    
                    if (notConnectedPlatforms.length > 0) {
                      alert(`다음 플랫폼이 연동되지 않았습니다: ${notConnectedPlatforms.join(', ')}\n\n플랫폼 연동 페이지에서 먼저 연동해주세요.`)
                      return
                    }
                    
                    // 실제 발행 로직 (여기서는 시뮬레이션)
                    const publishPromises = selectedPlatforms.map(platform => 
                      new Promise(resolve => setTimeout(() => resolve(platform), 1000))
                    )
                    
                    alert('발행 중입니다...')
                    await Promise.all(publishPromises)
                    alert(`${selectedPlatforms.join(', ')}에 성공적으로 발행되었습니다!`)
                  }}
                >
                  즉시 발행
                </Button>
                <Button onClick={() => setShowScheduleModal(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  예약 발행
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">발행할 플랫폼 선택</Label>
                <div className="grid grid-cols-2 gap-4">
                  {['티스토리', '네이버 블로그', '브런치', '워드프레스', '미디엄', '벨로그'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
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
              
              {selectedPlatforms.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">플랫폼별 세부 설정</h4>
                  <div className="space-y-3">
                    {selectedPlatforms.map((platform) => (
                      <div key={platform} className="flex items-center gap-3">
                        <Label className="w-32">{platform}</Label>
                        <Input placeholder="카테고리" className="flex-1" />
                        <Input placeholder="태그 (쉼표로 구분)" className="flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                      취소
                    </Button>
                    <Button onClick={() => {
                      console.log('예약 발행:', { date: scheduleDate, time: scheduleTime, platforms: selectedPlatforms })
                      alert(`${scheduleDate} ${scheduleTime}에 예약되었습니다!`)
                      setShowScheduleModal(false)
                    }}>
                      예약하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 스크린샷 갤러리 */}
        {showGallery && (
          <ScreenshotGallery
            lessonType="notion"
            lessonId={lessonId || 0}
            onSelect={(url) => {
              const imgTag = `\n<img src="${url}" alt="스크린샷" class="screenshot" />\n`
              setContent(content + imgTag)
              setShowGallery(false)
            }}
            onClose={() => setShowGallery(false)}
          />
        )}
      </div>
    </div>
  )
}