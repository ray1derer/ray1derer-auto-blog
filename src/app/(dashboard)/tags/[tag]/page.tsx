'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Eye, Tag as TagIcon } from 'lucide-react'
import { getPostsByTag, type Post } from '@/lib/storage'

export default function TagPostsPage() {
  const params = useParams()
  const tag = decodeURIComponent(params.tag as string)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    setPosts(getPostsByTag(tag))
  }, [tag])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/tags">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TagIcon className="h-8 w-8" />
              {tag}
            </h1>
            <p className="text-muted-foreground">
              이 태그를 포함하는 {posts.length}개의 포스트
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                "{tag}" 태그를 포함하는 포스트가 없습니다
              </p>
              <Link href="/posts/new">
                <Button className="mt-4">
                  새 포스트 작성하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Link href={`/posts/${post.id}`}>
                      <CardTitle className="hover:text-primary cursor-pointer">
                        {post.title}
                      </CardTitle>
                    </Link>
                    {post.description && (
                      <CardDescription>{post.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant={
                    post.status === 'published' ? 'default' :
                    post.status === 'scheduled' ? 'secondary' : 'outline'
                  }>
                    {post.status === 'published' ? '게시됨' :
                     post.status === 'scheduled' ? '예약됨' : '초안'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('ko-KR')}
                  </div>
                  {post.scheduledDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      예약: {new Date(post.scheduledDate).toLocaleDateString('ko-KR')} {post.scheduledTime}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.category}
                  </div>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((t) => (
                      <Link key={t} href={`/tags/${encodeURIComponent(t)}`}>
                        <Badge 
                          variant="outline" 
                          className={t === tag ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'}
                        >
                          {t}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Link href={`/posts/${post.id}`}>
                    <Button size="sm">보기</Button>
                  </Link>
                  <Link href={`/posts/${post.id}/edit`}>
                    <Button size="sm" variant="outline">편집</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}