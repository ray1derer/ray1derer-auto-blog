"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import { getPosts, deletePost } from "@/lib/storage"

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    const allPosts = getPosts()
    setPosts(allPosts)
    setLoading(false)
  }

  const handleDelete = (postId: string) => {
    if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
      deletePost(postId)
      loadPosts()
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold">포스트 관리</h1>
        <Link href="/posts/new">
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
            type="text"
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
            <p className="text-muted-foreground">
              {searchQuery ? "검색 결과가 없습니다." : "아직 작성된 포스트가 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchQuery ? "다른 검색어를 시도해보세요." : "새 포스트를 작성하여 블로그를 시작해보세요."}
            </p>
            {!searchQuery && (
              <Link href="/posts/new" className="mt-4">
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
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.category || '미분류'}</span>
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
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
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