import { Metadata } from 'next'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string | string[]
  author?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'blog'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

const DEFAULT_SITE_NAME = 'Ray1derer Auto Blog'
const DEFAULT_DESCRIPTION = '최신 AI 도구와 생산성 향상을 위한 블로그'
const DEFAULT_KEYWORDS = ['AI', '인공지능', 'Claude AI', 'Cursor AI', 'Notion', 'Obsidian', '생산성', '자동화', '블로그']
const DEFAULT_AUTHOR = 'Ray1derer'
const DEFAULT_IMAGE = '/og-image.png'

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  author = DEFAULT_AUTHOR,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags
}: SEOProps): Metadata {
  const metaTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

  const metadata: Metadata = {
    title: metaTitle,
    description,
    keywords: keywordsString,
    authors: [{ name: author }],
    creator: author,
    publisher: DEFAULT_SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    openGraph: {
      title: metaTitle,
      description,
      type: type as any,
      siteName: DEFAULT_SITE_NAME,
      locale: 'ko_KR',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || DEFAULT_SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      creator: `@${author}`,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  if (url) {
    metadata.openGraph!.url = url
    metadata.alternates = {
      canonical: url,
    }
  }

  if (type === 'article' && publishedTime) {
    metadata.openGraph!.type = 'article'
    metadata.openGraph!.article = {
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: [author],
      section,
      tags,
    }
  }

  return metadata
}

export function generateJsonLd({
  title,
  description,
  author = DEFAULT_AUTHOR,
  image,
  url,
  publishedTime,
  modifiedTime,
  type = 'website',
  keywords,
}: SEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  if (type === 'article' || type === 'blog') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      author: {
        '@type': 'Person',
        name: author,
      },
      image: image ? `${baseUrl}${image}` : `${baseUrl}${DEFAULT_IMAGE}`,
      url: url ? `${baseUrl}${url}` : baseUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      publisher: {
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url ? `${baseUrl}${url}` : baseUrl,
      },
      keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}