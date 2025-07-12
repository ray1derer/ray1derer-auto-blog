"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { getPosts, savePost, getCategories } from "@/lib/storage"

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [loading, setLoading] = useState(true)
  const [originalPost, setOriginalPost] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    // 카테고리 로드
    const loadedCategories = getCategories()
    setCategories(loadedCategories)

    // 포스트 로드
    const posts = getPosts()
    const foundPost = posts.find(p => p.id === params.id)
    if (foundPost) {
      setOriginalPost(foundPost)
      setTitle(foundPost.title)
      setContent(foundPost.content)
      setDescription(foundPost.description || "")
      setCategory(foundPost.category)
      setTags(foundPost.tags?.join(", ") || "")
      setStatus(foundPost.status)
    }
    setLoading(false)
  }, [params.id])

  const handleSave = () => {
    if (!title || !content || !category) {
      alert("제목, 내용, 카테고리는 필수입니다.")
      return
    }

    const updatedPost = {
      ...originalPost,
      title,
      content,
      description,
      category,
      status,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    savePost(updatedPost)
    alert("포스트가 수정되었습니다.")
    router.push(`/posts/${originalPost.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!originalPost) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">포스트를 찾을 수 없습니다.</p>
        <Link href="/posts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            포스트 목록으로
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/posts/${originalPost.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">포스트 수정</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/posts/${originalPost.id}`}>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              미리보기
            </Button>
          </Link>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            저장
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
                <Label htmlFor="status">상태</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">초안</SelectItem>
                    <SelectItem value="published">발행됨</SelectItem>
                    <SelectItem value="scheduled">예약됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">태그</Label>
              <Input
                id="tags"
                placeholder="태그를 쉼표로 구분하여 입력하세요"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>내용 편집</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="content">HTML 내용</Label>
              <Textarea
                id="content"
                placeholder="HTML 형식으로 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}