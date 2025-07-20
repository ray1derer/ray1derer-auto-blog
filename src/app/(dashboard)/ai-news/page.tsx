"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, RefreshCw, Calendar, Building } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface NewsItem {
  id: string
  title: string
  summary: string
  date: Date
  source: string
  sourceType: "AI Times" | "OpenAI Blog" | "Google AI Blog" | "Anthropic News" | "Microsoft AI Blog"
  link: string
  tags?: string[]
}

// 샘플 뉴스 데이터 (실제로는 API나 크롤링을 통해 가져와야 함)
const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "GPT-4 Turbo with Vision 업데이트 발표",
    summary: "OpenAI가 GPT-4 Turbo의 새로운 비전 기능을 발표했습니다. 이미지 인식 정확도가 크게 향상되었으며, 다중 이미지 처리 기능이 추가되었습니다.",
    date: new Date("2024-01-15"),
    source: "OpenAI Blog",
    sourceType: "OpenAI Blog",
    link: "https://openai.com/blog",
    tags: ["GPT-4", "Vision", "Update"]
  },
  {
    id: "2",
    title: "Google Gemini Pro 1.5 공개",
    summary: "Google이 Gemini Pro 1.5 모델을 공개했습니다. 100만 토큰의 컨텍스트 윈도우를 지원하며, 멀티모달 성능이 대폭 개선되었습니다.",
    date: new Date("2024-01-14"),
    source: "Google AI Blog",
    sourceType: "Google AI Blog",
    link: "https://ai.googleblog.com",
    tags: ["Gemini", "Google", "LLM"]
  },
  {
    id: "3",
    title: "AI 규제 법안 EU 의회 통과",
    summary: "유럽연합 의회가 세계 최초의 포괄적인 AI 규제 법안을 통과시켰습니다. 고위험 AI 시스템에 대한 엄격한 규제가 포함되어 있습니다.",
    date: new Date("2024-01-13"),
    source: "AI Times",
    sourceType: "AI Times",
    link: "https://aitimes.com",
    tags: ["Regulation", "EU", "Policy"]
  },
  {
    id: "4",
    title: "Claude 3 모델 성능 벤치마크 결과 공개",
    summary: "Anthropic의 Claude 3 모델이 다양한 벤치마크에서 우수한 성능을 보였습니다. 특히 수학 추론과 코딩 작업에서 뛰어난 결과를 기록했습니다.",
    date: new Date("2024-01-12"),
    source: "Anthropic News",
    sourceType: "Anthropic News",
    link: "https://anthropic.com/news",
    tags: ["Claude", "Benchmark", "Performance"]
  },
  {
    id: "5",
    title: "Microsoft Copilot Pro 출시",
    summary: "Microsoft가 개인 사용자를 위한 Copilot Pro를 출시했습니다. GPT-4 Turbo 접근과 Office 앱 통합 기능을 제공합니다.",
    date: new Date("2024-01-11"),
    source: "Microsoft AI Blog",
    sourceType: "Microsoft AI Blog",
    link: "https://blogs.microsoft.com/ai",
    tags: ["Copilot", "Microsoft", "Productivity"]
  }
]

const sourceColors: Record<string, string> = {
  "AI Times": "bg-blue-500",
  "OpenAI Blog": "bg-green-500",
  "Google AI Blog": "bg-red-500",
  "Anthropic News": "bg-purple-500",
  "Microsoft AI Blog": "bg-indigo-500"
}

export default function AINewsPage() {
  const [news, setNews] = useState<NewsItem[]>(sampleNews)
  const [loading, setLoading] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  const refreshNews = async () => {
    setLoading(true)
    // 실제로는 여기서 API 호출이나 크롤링을 수행
    setTimeout(() => {
      setNews([...sampleNews])
      setLoading(false)
    }, 1000)
  }

  const filteredNews = selectedSource
    ? news.filter(item => item.sourceType === selectedSource)
    : news

  const sources = Array.from(new Set(news.map(item => item.sourceType)))

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI 뉴스</h1>
          <p className="text-muted-foreground mt-2">
            최신 AI 기술 동향과 뉴스를 한눈에 확인하세요
          </p>
        </div>
        <Button onClick={refreshNews} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={selectedSource === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedSource(null)}
        >
          전체
        </Button>
        {sources.map(source => (
          <Button
            key={source}
            variant={selectedSource === source ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSource(source)}
          >
            {source}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="grid gap-4">
          {filteredNews.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl leading-tight">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <Badge 
                          variant="secondary" 
                          className={`${sourceColors[item.sourceType]} text-white`}
                        >
                          {item.source}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(item.date, { 
                            addSuffix: true, 
                            locale: ko 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {item.summary}
                </CardDescription>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}