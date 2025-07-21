import { Post, getPosts, getCategories } from './storage'

interface RSSOptions {
  title: string
  description: string
  siteUrl: string
  feedUrl: string
  language?: string
  copyright?: string
  posts: Post[]
}

// HTML 태그 제거 함수
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

// XML 특수문자 이스케이프
function escapeXml(text: string): string {
  const xmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }
  return text.replace(/[&<>"']/g, (char) => xmlEscapeMap[char] || char)
}

// RSS 2.0 XML 생성
export function generateRSS(options: RSSOptions): string {
  const {
    title,
    description,
    siteUrl,
    feedUrl,
    language = 'ko',
    copyright = '',
    posts
  } = options

  const buildDate = new Date().toUTCString()
  
  // 게시된 포스트만 필터링하고 날짜순으로 정렬
  const publishedPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const rssItems = publishedPosts.map(post => {
    const postUrl = `${siteUrl}/posts/${post.id}`
    const pubDate = new Date(post.date).toUTCString()
    const contentPreview = post.description || stripHtml(post.content).substring(0, 200) + '...'
    
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(contentPreview)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${copyright ? `<copyright>${escapeXml(copyright)}</copyright>` : ''}
    ${rssItems}
  </channel>
</rss>`
}

// 전체 RSS 피드 생성
export function generateMainRSS(siteUrl: string): string {
  const posts = getPosts()
  
  return generateRSS({
    title: 'My Blog',
    description: '최신 블로그 포스트',
    siteUrl,
    feedUrl: `${siteUrl}/rss.xml`,
    posts
  })
}

// 카테고리별 RSS 피드 생성
export function generateCategoryRSS(category: string, siteUrl: string): string {
  const posts = getPosts().filter(post => post.category === category)
  const categories = getCategories()
  const categoryInfo = categories.find(cat => cat.slug === category)
  const categoryName = categoryInfo?.name || category
  
  return generateRSS({
    title: `My Blog - ${categoryName}`,
    description: `${categoryName} 카테고리의 최신 포스트`,
    siteUrl,
    feedUrl: `${siteUrl}/categories/${category}/rss.xml`,
    posts
  })
}