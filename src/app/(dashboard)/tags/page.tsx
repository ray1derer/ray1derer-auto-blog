'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Tag } from 'lucide-react'
import { TagCloud } from '@/components/ui/tag-cloud'
import { getTags, type Tag as TagType } from '@/lib/storage'

export default function TagsPage() {
  const [tags, setTags] = useState<TagType[]>([])
  const [viewMode, setViewMode] = useState<'cloud' | 'list'>('cloud')

  useEffect(() => {
    setTags(getTags())
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">태그 관리</h1>
            <p className="text-muted-foreground">포스트에 사용된 모든 태그를 확인하세요</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'cloud' ? 'default' : 'outline'}
            onClick={() => setViewMode('cloud')}
          >
            클라우드 보기
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            목록 보기
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              인기 태그
            </CardTitle>
            <CardDescription>
              가장 많이 사용된 태그들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TagCloud limit={30} showCount={true} />
          </CardContent>
        </Card>

        {viewMode === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle>전체 태그 목록</CardTitle>
              <CardDescription>
                총 {tags.length}개의 태그가 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tags.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    아직 사용된 태그가 없습니다
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/tags/${encodeURIComponent(tag.name)}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                          <div className="flex items-center gap-3">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{tag.name}</span>
                          </div>
                          <Badge variant="secondary">
                            {tag.count}개의 포스트
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>태그 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">전체 태그 수</p>
                <p className="text-2xl font-bold">{tags.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">평균 사용 횟수</p>
                <p className="text-2xl font-bold">
                  {tags.length > 0 
                    ? (tags.reduce((sum, tag) => sum + tag.count, 0) / tags.length).toFixed(1)
                    : 0}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">가장 인기있는 태그</p>
                <p className="text-2xl font-bold">
                  {tags.length > 0 ? tags.sort((a, b) => b.count - a.count)[0]?.name : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}