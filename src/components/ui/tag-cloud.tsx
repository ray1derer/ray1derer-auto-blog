'use client'

import Link from 'next/link'
import { getPopularTags, type Tag } from '@/lib/storage'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

interface TagCloudProps {
  limit?: number
  className?: string
  showCount?: boolean
}

export function TagCloud({ 
  limit = 20, 
  className = '',
  showCount = true 
}: TagCloudProps) {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    setTags(getPopularTags(limit))
  }, [limit])

  if (tags.length === 0) {
    return null
  }

  // 태그 크기 계산 (사용 빈도에 따라)
  const maxCount = Math.max(...tags.map(t => t.count))
  const minCount = Math.min(...tags.map(t => t.count))
  const range = maxCount - minCount || 1

  const getTagSize = (count: number) => {
    const ratio = (count - minCount) / range
    if (ratio > 0.8) return 'text-lg font-semibold'
    if (ratio > 0.6) return 'text-base font-medium'
    if (ratio > 0.4) return 'text-sm'
    return 'text-xs'
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <Link
          key={tag.name}
          href={`/tags/${encodeURIComponent(tag.name)}`}
          className="inline-block"
        >
          <Badge 
            variant="outline" 
            className={`hover:bg-primary hover:text-primary-foreground transition-colors ${getTagSize(tag.count)}`}
          >
            {tag.name}
            {showCount && (
              <span className="ml-1 text-muted-foreground">({tag.count})</span>
            )}
          </Badge>
        </Link>
      ))}
    </div>
  )
}