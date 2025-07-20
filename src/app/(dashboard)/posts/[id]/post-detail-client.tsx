"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { deletePost } from "@/lib/storage"

interface PostDetailClientProps {
  post: any
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const router = useRouter()

  const handleDelete = () => {
    if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
      deletePost(post.id)
      router.push("/posts")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Link href="/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              포스트 목록
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Link href={`/posts/${post.id}/edit`}>
              <Button size="sm">
                <Edit className="mr-2 h-4 w-4" />
                편집
              </Button>
            </Link>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}
            </div>
            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
              {post.status === 'published' ? '발행됨' : 
               post.status === 'scheduled' ? '예약됨' : '초안'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.category || '미분류'}</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-1">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={() => router.push("/posts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>
        <Link href={`/posts/${post.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            포스트 편집
          </Button>
        </Link>
      </div>
    </div>
  )
}