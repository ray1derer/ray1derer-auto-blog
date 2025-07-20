import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPosts } from "@/lib/storage"
import { generateMetadata as generateSEOMetadata, generateJsonLd } from "@/components/seo/metadata"
import PostDetailClient from "./post-detail-client"
import Script from "next/script"

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const posts = getPosts()
  const post = posts.find(p => p.id === params.id)

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다",
    }
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.description || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
    keywords: post.tags || [],
    type: 'article',
    url: `/posts/${post.id}`,
    publishedTime: post.date,
    modifiedTime: post.updatedAt || post.date,
    section: post.category || '미분류',
    tags: post.tags,
  })
}

export default function PostPage({ params }: PostPageProps) {
  const posts = getPosts()
  const post = posts.find(p => p.id === params.id)

  if (!post) {
    notFound()
  }

  const jsonLd = generateJsonLd({
    title: post.title,
    description: post.description || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
    author: post.author || 'Ray1derer',
    url: `/posts/${post.id}`,
    publishedTime: post.date,
    modifiedTime: post.updatedAt || post.date,
    type: 'article',
    keywords: post.tags || [],
  })

  return (
    <>
      <Script
        id={`json-ld-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      <PostDetailClient post={post} />
    </>
  )
}