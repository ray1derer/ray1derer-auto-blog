"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ScheduledPost {
  id: string
  postId: string
  title: string
  date: string
  time: string
  platforms: string[]
  status: 'pending' | 'published'
}

export default function SchedulePage() {
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [postTitle, setPostTitle] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [todayCount, setTodayCount] = useState(0)
  const [weekCount, setWeekCount] = useState(0)

  useEffect(() => {
    loadScheduledPosts()
  }, [])

  const loadScheduledPosts = async () => {
    const { getScheduledPosts } = await import('@/lib/storage')
    const posts = getScheduledPosts()
    setScheduledPosts(posts)
    
    // 오늘 발행 예정 카운트
    const today = new Date().toISOString().split('T')[0]
    const todayPosts = posts.filter(post => post.date === today && post.status === 'pending')
    setTodayCount(todayPosts.length)
    
    // 이번 주 예약 카운트
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 7))
    
    const weekPosts = posts.filter(post => {
      const postDate = new Date(post.date)
      return postDate >= weekStart && postDate <= weekEnd && post.status === 'pending'
    })
    setWeekCount(weekPosts.length)
  }

  const handleAddSchedule = () => {
    setShowScheduleModal(true)
    const today = new Date().toISOString().split('T')[0]
    setScheduleDate(today)
    setScheduleTime('10:00')
  }

  const handleConfirmSchedule = async () => {
    if (!postTitle || !selectedCategory || selectedPlatforms.length === 0) {
      alert("모든 필드를 입력하고 최소 하나의 플랫폼을 선택해주세요.")
      return
    }
    
    const { savePost, saveScheduledPost } = await import('@/lib/storage')
    
    // 새 포스트 생성
    const newPost = {
      id: Date.now().toString(),
      title: postTitle,
      content: '',  // 예약 페이지에서는 내용 없이 생성
      category: selectedCategory,
      status: 'scheduled' as const,
      date: new Date().toISOString().split('T')[0],
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      platforms: selectedPlatforms
    }
    
    savePost(newPost)
    
    // 예약 발행 정보 저장
    const scheduledPost = {
      id: Date.now().toString() + '_scheduled',
      postId: newPost.id,
      title: postTitle,
      date: scheduleDate,
      time: scheduleTime,
      platforms: selectedPlatforms,
      status: 'pending' as const
    }
    
    saveScheduledPost(scheduledPost)
    
    alert(`"${postTitle}" 포스트가 ${scheduleDate} ${scheduleTime}에 발행 예약되었습니다.`)
    setShowScheduleModal(false)
    setPostTitle("")
    setSelectedCategory("")
    setSelectedPlatforms([])
    
    // 리스트 새로고침
    loadScheduledPosts()
  }

  const handleDeleteSchedule = async (id: string) => {
    if (confirm("이 예약을 삭제하시겠습니까?")) {
      const { getScheduledPosts, saveScheduledPosts } = await import('@/lib/storage')
      const posts = getScheduledPosts()
      const updatedPosts = posts.filter(post => post.id !== id)
      saveScheduledPosts(updatedPosts)
      loadScheduledPosts()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">예약 발행</h1>
        <Button onClick={handleAddSchedule}>
          <Plus className="mr-2 h-4 w-4" />
          새 예약 추가
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              오늘 발행 예정
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">
              포스트가 발행될 예정입니다
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              이번 주 예약
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekCount}</div>
            <p className="text-xs text-muted-foreground">
              포스트가 예약되어 있습니다
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>예약 발행 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledPosts.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">예약된 발행이 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-2">
                포스트를 작성하고 발행 일정을 예약해보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{post.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.time}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {post.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                        {post.status === 'published' ? '발행됨' : '대기중'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteSchedule(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 예약 추가 모달 */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>새 예약 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">포스트 제목</Label>
                  <Input
                    id="title"
                    placeholder="제목을 입력하세요"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notion">노션</SelectItem>
                      <SelectItem value="obsidian">옵시디언</SelectItem>
                      <SelectItem value="cursor-ai">커서 AI</SelectItem>
                      <SelectItem value="claude-ai">클로드 AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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