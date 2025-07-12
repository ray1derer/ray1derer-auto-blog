"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Link2, Instagram, TrendingUp, Eye, Edit, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { notionLessons } from "@/lib/notion-lessons"
import { obsidianLessons } from "@/lib/obsidian-lessons"
import { cursorLessons } from "@/lib/cursor-lessons"
import { claudeLessons } from "@/lib/claude-lessons"
import { getPosts, getScheduledPosts, getPlatformConnections, getPostStats } from "@/lib/storage"

export default function Home() {
  const [totalLessons, setTotalLessons] = useState(0)
  const [posts, setPosts] = useState<any[]>([])
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [connectedPlatforms, setConnectedPlatforms] = useState(0)
  const [stats, setStats] = useState<any>({})
  
  useEffect(() => {
    const total = notionLessons.length + obsidianLessons.length + 
                  cursorLessons.length + claudeLessons.length
    setTotalLessons(total)
    
    // 실제 데이터 로드
    const loadedPosts = getPosts()
    const loadedScheduled = getScheduledPosts()
    const platforms = getPlatformConnections()
    const postStats = getPostStats()
    
    setPosts(loadedPosts.slice(0, 3)) // 최근 3개만
    setScheduledPosts(loadedScheduled.filter(s => s.status === 'pending').slice(0, 2)) // 예정된 것 중 2개만
    setConnectedPlatforms(platforms.filter(p => p.status === 'connected').length)
    setStats(postStats)
  }, [])

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">대시보드</h1>
            <Link href="/posts">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                새 포스트 작성
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  전체 강좌
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLessons}</div>
                <p className="text-xs text-muted-foreground">
                  4개 카테고리
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  예약된 포스트
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.scheduled || 0}</div>
                <p className="text-xs text-muted-foreground">
                  이번 주 {stats.scheduledThisWeek || 0}개 발행 예정
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  연동된 플랫폼
                </CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{connectedPlatforms}</div>
                <p className="text-xs text-muted-foreground">
                  {connectedPlatforms > 0 ? '플랫폼 연동됨' : '연동된 플랫폼 없음'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  이번 달 조회수
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.monthlyViews ? 
                    (stats.monthlyViews >= 1000 ? 
                      `${(stats.monthlyViews / 1000).toFixed(1)}K` : 
                      stats.monthlyViews) 
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.growthRate !== undefined ? 
                    (stats.growthRate > 0 ? `+${stats.growthRate}%` : `${stats.growthRate}%`) : 
                    '0%'} 전월 대비
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 mt-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>최근 작업한 포스트</CardTitle>
                    <CardDescription>
                      최근 편집하거나 발행한 포스트입니다
                    </CardDescription>
                  </div>
                  <Link href="/posts">
                    <Button variant="ghost" size="sm">
                      전체 보기
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                          <Badge className="bg-green-500">발행됨</Badge>
                        )}
                        {post.status === 'draft' && (
                          <Badge variant="secondary">초안</Badge>
                        )}
                        {post.status === 'scheduled' && (
                          <Badge className="bg-blue-500">예약됨</Badge>
                        )}
                        <Link href={`/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center p-4">
                    아직 작성된 포스트가 없습니다
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>예약 발행 일정</CardTitle>
                    <CardDescription>
                      다가오는 발행 일정입니다
                    </CardDescription>
                  </div>
                  <Link href="/schedule">
                    <Button variant="ghost" size="sm">
                      전체 보기
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledPosts.length > 0 ? (
                  scheduledPosts.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium">{schedule.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {schedule.date} {schedule.time}
                          </span>
                          {schedule.platforms.map((platform: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center p-4">
                    예약된 발행이 없습니다
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>강좌별 통계</CardTitle>
                    <CardDescription>
                      각 강좌 카테고리의 콘텐츠 현황입니다
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/categories/lectures/notion">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-semibold">노션</h3>
                      <p className="text-2xl font-bold mt-2">{notionLessons.length}</p>
                      <p className="text-xs text-muted-foreground">강좌</p>
                    </div>
                  </Link>
                  <Link href="/categories/lectures/obsidian">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-semibold">옵시디언</h3>
                      <p className="text-2xl font-bold mt-2">{obsidianLessons.length}</p>
                      <p className="text-xs text-muted-foreground">강좌</p>
                    </div>
                  </Link>
                  <Link href="/categories/lectures/cursor-ai">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-semibold">커서 AI</h3>
                      <p className="text-2xl font-bold mt-2">{cursorLessons.length}</p>
                      <p className="text-xs text-muted-foreground">강좌</p>
                    </div>
                  </Link>
                  <Link href="/categories/lectures/claude-ai">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-semibold">클로드 AI</h3>
                      <p className="text-2xl font-bold mt-2">{claudeLessons.length}</p>
                      <p className="text-xs text-muted-foreground">강좌</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}