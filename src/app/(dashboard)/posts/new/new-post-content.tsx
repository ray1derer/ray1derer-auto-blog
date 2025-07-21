"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Calendar, Eye, Sparkles, ImagePlus, Image } from "lucide-react"
import Link from "next/link"
import { ScreenshotGallery } from "@/components/screenshot-gallery"
import { getCategories } from "@/lib/storage"
import { TagInput } from "@/components/ui/tag-input"

export default function NewPostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [showHtmlEditor, setShowHtmlEditor] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  // 카테고리 로드
  useEffect(() => {
    const loadedCategories = getCategories()
    setCategories(loadedCategories)
  }, [])
  
  // URL 파라미터에서 카테고리 가져오기
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setCategory(categoryFromUrl)
    }
  }, [searchParams])

  const convertToHtml = (text: string): string => {
    // 자동으로 텍스트를 HTML로 변환
    let html = text
      // 제목 변환 (# 기호)
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 굵은 글씨
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 기울임
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 코드 블록
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // 인라인 코드
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // 링크
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // 이미지
      .replace(/!\[([^\]]*?)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // 리스트
      .replace(/^\* (.+)$/gim, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
      // 줄바꿈을 단락으로
      .split('\n\n')
      .map(para => {
        para = para.trim()
        if (para.startsWith('<h') || para.startsWith('<pre>') || para.startsWith('<li>')) {
          return para
        }
        return para ? `<p>${para}</p>` : ''
      })
      .join('\n')
    
    // 리스트 아이템들을 ul/ol로 감싸기
    html = html.replace(/(<li>.*<\/li>\s*)+/g, (match) => {
      return `<ul>\n${match}</ul>`
    })
    
    return html
  }

  const handleSave = async () => {
    if (!title || !content || !category) {
      alert("제목, 내용, 카테고리는 필수입니다.")
      return
    }
    
    const { savePost } = await import('@/lib/storage')
    const htmlContent = convertToHtml(content)
    
    const newPost = {
      id: Date.now().toString(),
      title,
      content: htmlContent,
      description,
      category,
      status: 'draft' as const,
      date: new Date().toISOString().split('T')[0],
      tags: tags
    }
    
    savePost(newPost)
    alert("포스트가 저장되었습니다.")
    router.push("/posts")
  }

  const handleSchedule = () => {
    if (!title || !content || !category) {
      alert("제목, 내용, 카테고리는 필수입니다.")
      return
    }
    
    setShowScheduleModal(true)
    const today = new Date().toISOString().split('T')[0]
    setScheduleDate(today)
    setScheduleTime('10:00')
  }

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // 실제 업로드 로직 구현 필요
        const imageUrl = URL.createObjectURL(file)
        setContent(content + `\n\n![${file.name}](${imageUrl})`)
      }
    }
    input.click()
  }

  const handleAutoScreenshot = async () => {
    if (!content || !title) {
      alert('포스트 내용을 먼저 작성해주세요.')
      return
    }

    try {
      const response = await fetch('/api/screenshot/auto-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonType: category || 'general',
          title,
          content,
        }),
      })

      const data = await response.json()

      if (data.success && data.screenshots.length > 0) {
        // 생성된 스크린샷들을 마크다운 형식으로 추가
        let updatedContent = content
        data.screenshots.forEach((screenshot: any) => {
          updatedContent += `\n\n![${screenshot.caption}](${screenshot.url})`
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

  const handleConfirmSchedule = async () => {
    if (selectedPlatforms.length === 0) {
      alert("최소 하나의 플랫폼을 선택해주세요.")
      return
    }
    
    const { savePost, saveScheduledPost } = await import('@/lib/storage')
    const htmlContent = convertToHtml(content)
    
    // 포스트 저장
    const newPost = {
      id: Date.now().toString(),
      title,
      content: htmlContent,
      description,
      category,
      status: 'scheduled' as const,
      date: new Date().toISOString().split('T')[0],
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      platforms: selectedPlatforms,
      tags: tags
    }
    
    savePost(newPost)
    
    // 예약 발행 저장
    const scheduledPost = {
      id: Date.now().toString() + '_scheduled',
      postId: newPost.id,
      title,
      date: scheduleDate,
      time: scheduleTime,
      platforms: selectedPlatforms,
      status: 'pending' as const
    }
    
    saveScheduledPost(scheduledPost)
    
    alert(`"${title}" 포스트가 ${scheduleDate} ${scheduleTime}에 발행 예약되었습니다.`)
    setShowScheduleModal(false)
    router.push("/posts")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">새 포스트 작성</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {isPreview ? '편집모드' : '미리보기'}
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            임시 저장
          </Button>
          <Button onClick={handleSchedule}>
            <Calendar className="mr-2 h-4 w-4" />
            예약 발행
          </Button>
        </div>
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
                placeholder="포스트 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description">설명</Label>
              <Input
                id="description"
                placeholder="포스트 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">태그</Label>
                <TagInput
                  value={tags}
                  onChange={setTags}
                  placeholder="태그를 입력하세요 (쉼표로 구분)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>콘텐츠 작성</CardTitle>
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
            {isPreview ? (
              <div>
                <h3 className="font-semibold mb-2">미리보기</h3>
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
                          h1, h2, h3, h4 { color: #2c3e50; margin-top: 1.5em; margin-bottom: 0.5em; }
                          h1 { font-size: 2.5em; }
                          h2 { font-size: 1.8em; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                          h3 { font-size: 1.4em; }
                          p { margin-bottom: 1em; }
                          ul, ol { margin-left: 20px; margin-bottom: 1em; }
                          li { margin-bottom: 0.5em; }
                          strong { color: #e74c3c; }
                          em { color: #3498db; }
                          code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
                          pre { background-color: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
                          pre code { background: none; padding: 0; }
                          a { color: #3498db; text-decoration: none; }
                          a:hover { text-decoration: underline; }
                          img { max-width: 100%; height: auto; margin: 15px 0; }
                          blockquote { border-left: 4px solid #3498db; padding-left: 15px; margin: 15px 0; color: #666; }
                        </style>
                      </head>
                      <body>
                        ${convertToHtml(content)}
                      </body>
                      </html>
                    `}
                    className="w-full h-full border-0"
                    title="미리보기"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">마크다운 작성 가이드</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><code># 제목 1</code> → 큰 제목</p>
                      <p><code>## 제목 2</code> → 중간 제목</p>
                      <p><code>### 제목 3</code> → 작은 제목</p>
                      <p><code>**굵은 글씨**</code> → <strong>굵은 글씨</strong></p>
                      <p><code>*기울임*</code> → <em>기울임</em></p>
                    </div>
                    <div>
                      <p><code>[링크](URL)</code> → 링크 추가</p>
                      <p><code>![이미지](URL)</code> → 이미지 추가</p>
                      <p><code>`코드`</code> → 인라인 코드</p>
                      <p><code>* 항목</code> → 리스트</p>
                      <p><code>1. 항목</code> → 번호 리스트</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">내용 (마크다운 형식)</Label>
                  <Textarea
                    id="content"
                    placeholder="마크다운 형식으로 내용을 작성하세요...\n\n# 제목\n일반 텍스트를 입력하면 자동으로 단락이 됩니다.\n\n## 부제목\n**굵은 글씨**와 *기울임*을 사용할 수 있습니다."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[500px] font-mono"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>발행 설정</CardTitle>
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
            </div>
          </CardContent>
        </Card>
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
      
      {/* 스크린샷 갤러리 */}
      {showGallery && (
        <ScreenshotGallery
          lessonType={category || 'general'}
          lessonId={0}
          onSelect={(url) => {
            // 마크다운 형식으로 이미지 추가
            const imgTag = `\n![스크린샷](${url})\n`
            setContent(content + imgTag)
            setShowGallery(false)
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  )
}