"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, Calendar, Eye, Edit, FolderOpen } from "lucide-react"
import Link from "next/link"
import { getPosts } from "@/lib/storage"

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 카테고리 이름 포맷팅
  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  useEffect(() => {
    // 카테고리에 해당하는 포스트 로드
    const allPosts = getPosts()
    const categoryPosts = allPosts.filter(post => 
      post.category === categorySlug || 
      (post.category === 'uncategorized' && categorySlug === 'uncategorized')
    )
    setPosts(categoryPosts)
    setLoading(false)
  }, [categorySlug])

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSchedule = (postId: string) => {
    // 예약 발행 로직
    console.log('Schedule post:', postId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-2">
            {posts.length}개의 포스트
          </p>
        </div>
        <Link href={`/posts/new?category=${categorySlug}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            새 포스트 작성
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="포스트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '아직 포스트가 없습니다'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchQuery 
                ? '다른 검색어를 시도해보세요.'
                : `${categoryName} 카테고리에 첫 번째 포스트를 작성해보세요.`
              }
            </p>
            {!searchQuery && (
              <Link href={`/posts/new?category=${categorySlug}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  첫 포스트 작성하기
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    {post.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {post.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status === 'published' ? '발행됨' : 
                     post.status === 'scheduled' ? '예약됨' : '초안'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{post.date}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/posts/${post.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      보기
                    </Button>
                  </Link>
                  <Link href={`/posts/${post.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      편집
                    </Button>
                  </Link>
                  <Button size="sm" onClick={() => handleSchedule(post.id)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    예약 발행
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}