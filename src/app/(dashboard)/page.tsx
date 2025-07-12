"use client"

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

export default function Home() {
  const [totalLessons, setTotalLessons] = useState(0)
  
  useEffect(() => {
    const total = notionLessons.length + obsidianLessons.length + 
                  cursorLessons.length + claudeLessons.length
    setTotalLessons(total)
  }, [])

  const recentPosts = [
    { id: 1, title: "노션으로 시작하는 생산성 향상", category: "노션", date: "2024-01-15", status: "published" },
    { id: 2, title: "옵시디언 기초 - 볼트 생성하기", category: "옵시디언", date: "2024-01-14", status: "draft" },
    { id: 3, title: "Cursor AI로 코딩 속도 높이기", category: "커서 AI", date: "2024-01-13", status: "scheduled" },
  ]

  const upcomingSchedule = [
    { id: 1, title: "Claude AI 프롬프트 엔지니어링", date: "2024-01-20", time: "14:00", platform: "티스토리" },
    { id: 2, title: "노션 데이터베이스 활용법", date: "2024-01-21", time: "10:00", platform: "네이버" },
  ]

  return (
    <>
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
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              이번 주 발행 예정
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
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              티스토리, 네이버 외
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
            <div className="text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">
              +12% 전월 대비
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
            {recentPosts.map((post) => (
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
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
            {upcomingSchedule.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium">{schedule.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {schedule.date} {schedule.time}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {schedule.platform}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
    </>
  )
}