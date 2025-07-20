"use client"

import { Suspense } from "react"
import NewPostContent from "./new-post-content"

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    }>
      <NewPostContent />
    </Suspense>
  )
}