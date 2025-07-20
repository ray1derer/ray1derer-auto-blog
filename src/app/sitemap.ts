import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/storage'
import { claudeLessons } from '@/lib/claude-lessons'
import { cursorLessons } from '@/lib/cursor-lessons'
import { notionLessons } from '@/lib/notion-lessons'
import { obsidianLessons } from '@/lib/obsidian-lessons'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  const currentDate = new Date()

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ai-news`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/platforms`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/schedule`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/instagram`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  // 카테고리 페이지들
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/categories/lectures/claude-ai`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories/lectures/cursor-ai`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories/lectures/notion`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories/lectures/obsidian`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // 블로그 포스트들
  const postPages: MetadataRoute.Sitemap = posts
    .filter(post => post.status === 'published')
    .map(post => ({
      url: `${BASE_URL}/posts/${post.id}`,
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  // Claude AI 강의들
  const claudePages: MetadataRoute.Sitemap = claudeLessons.map(lesson => ({
    url: `${BASE_URL}/categories/lectures/claude-ai/${lesson.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Cursor AI 강의들
  const cursorPages: MetadataRoute.Sitemap = cursorLessons.map(lesson => ({
    url: `${BASE_URL}/categories/lectures/cursor-ai/${lesson.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Notion 강의들
  const notionPages: MetadataRoute.Sitemap = notionLessons.map(lesson => ({
    url: `${BASE_URL}/categories/lectures/notion/${lesson.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Obsidian 강의들
  const obsidianPages: MetadataRoute.Sitemap = obsidianLessons.map(lesson => ({
    url: `${BASE_URL}/categories/lectures/obsidian/${lesson.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...postPages,
    ...claudePages,
    ...cursorPages,
    ...notionPages,
    ...obsidianPages,
  ]
}