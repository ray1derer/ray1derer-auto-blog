"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, RefreshCw, Calendar, Building } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NewsItem {
  id: string
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  image?: string
}

interface APIResponse {
  success: boolean
  data: NewsItem[]
  count: number
  timestamp: string
  error?: string
  message?: string
}

const sourceColors: Record<string, string> = {
  "TechCrunch": "bg-blue-500",
  "MIT Technology Review": "bg-green-500",
  "The Verge": "bg-red-500",
  "VentureBeat": "bg-purple-500"
}

export default function AINewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  const fetchNews = async (refresh = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const url = refresh ? '/api/ai-news?refresh=true' : '/api/ai-news'
      const response = await fetch(url)
      const data: APIResponse = await response.json()
      
      if (data.success) {
        setNews(data.data)
      } else {
        setError(data.message || 'Failed to fetch news')
      }
    } catch (err) {
      setError('Failed to connect to news service')
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const refreshNews = () => {
    fetchNews(true)
  }

  const filteredNews = selectedSource
    ? news.filter(item => item.source === selectedSource)
    : news

  const sources = Array.from(new Set(news.map(item => item.source)))

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI News</h1>
          <p className="text-muted-foreground mt-2">
            Real-time AI news from leading tech publications
          </p>
        </div>
        <Button onClick={refreshNews} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={selectedSource === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedSource(null)}
        >
          All Sources
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error loading news</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && news.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-muted-foreground">Loading AI news...</p>
          </div>
        </div>
      ) : (
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
                            className={`${sourceColors[item.source] || 'bg-gray-500'} text-white`}
                          >
                            {item.source}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(item.pubDate), { 
                              addSuffix: true
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
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <CardDescription className="text-base leading-relaxed">
                    {item.description.length > 200 
                      ? `${item.description.substring(0, 200)}...` 
                      : item.description
                    }
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}