// localStorage 기반 데이터 저장소
export interface Post {
  id: string
  title: string
  content: string
  description?: string
  category: string
  status: 'draft' | 'published' | 'scheduled'
  date: string
  platforms?: string[]
  scheduledDate?: string
  scheduledTime?: string
  tags?: string[]
}

export interface ScheduledPost {
  id: string
  postId: string
  title: string
  date: string
  time: string
  platforms: string[]
  status: 'pending' | 'published'
}

export interface PlatformConnection {
  id: string
  name: string
  status: 'connected' | 'disconnected'
  username?: string
  connectedAt?: string
}

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  SCHEDULED: 'scheduled_posts',
  PLATFORMS: 'platform_connections',
  INSTAGRAM: 'instagram_connection'
}

// Posts
export const getPosts = (): Post[] => {
  if (typeof window === 'undefined') return []
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS)
  return posts ? JSON.parse(posts) : []
}

export const savePost = (post: Post) => {
  const posts = getPosts()
  const existingIndex = posts.findIndex(p => p.id === post.id)
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post
  } else {
    posts.push(post)
  }
  
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
}

export const deletePost = (postId: string) => {
  const posts = getPosts()
  const filtered = posts.filter(p => p.id !== postId)
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered))
}

// Scheduled Posts
export const getScheduledPosts = (): ScheduledPost[] => {
  if (typeof window === 'undefined') return []
  const scheduled = localStorage.getItem(STORAGE_KEYS.SCHEDULED)
  return scheduled ? JSON.parse(scheduled) : []
}

export const saveScheduledPost = (scheduled: ScheduledPost) => {
  const scheduledPosts = getScheduledPosts()
  scheduledPosts.push(scheduled)
  localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(scheduledPosts))
}

export const saveScheduledPosts = (scheduledPosts: ScheduledPost[]) => {
  localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(scheduledPosts))
}

export const updateScheduledPost = (id: string, status: 'pending' | 'published') => {
  const scheduledPosts = getScheduledPosts()
  const index = scheduledPosts.findIndex(s => s.id === id)
  if (index >= 0) {
    scheduledPosts[index].status = status
    localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(scheduledPosts))
  }
}

// Platform Connections
export const getPlatformConnections = (): PlatformConnection[] => {
  if (typeof window === 'undefined') return []
  const platforms = localStorage.getItem(STORAGE_KEYS.PLATFORMS)
  return platforms ? JSON.parse(platforms) : []
}

export const savePlatformConnection = (platform: PlatformConnection) => {
  const platforms = getPlatformConnections()
  const existingIndex = platforms.findIndex(p => p.id === platform.id)
  
  if (existingIndex >= 0) {
    platforms[existingIndex] = platform
  } else {
    platforms.push(platform)
  }
  
  localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms))
}

// Instagram Connection
export const getInstagramConnection = () => {
  if (typeof window === 'undefined') return null
  const instagram = localStorage.getItem(STORAGE_KEYS.INSTAGRAM)
  return instagram ? JSON.parse(instagram) : null
}

export const saveInstagramConnection = (data: any) => {
  localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(data))
}

export const removeInstagramConnection = () => {
  localStorage.removeItem(STORAGE_KEYS.INSTAGRAM)
}

// 조회수 저장
export const saveViewCount = (postId: string, count: number) => {
  const views = getViewCounts()
  views[postId] = (views[postId] || 0) + count
  localStorage.setItem('blog_views', JSON.stringify(views))
}

export const getViewCounts = () => {
  if (typeof window === 'undefined') return {}
  const views = localStorage.getItem('blog_views')
  return views ? JSON.parse(views) : {}
}

// 통계 함수들
export const getPostStats = () => {
  const posts = getPosts()
  const scheduledPosts = getScheduledPosts()
  const today = new Date()
  const thisMonth = today.getMonth()
  const thisYear = today.getFullYear()
  const thisWeek = getWeekNumber(today)
  const viewCounts = getViewCounts()
  
  // 이번 달 총 조회수 계산
  const monthlyViews = posts.reduce((total, post) => {
    const postDate = new Date(post.date)
    if (postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear) {
      return total + (viewCounts[post.id] || 0)
    }
    return total
  }, 0)
  
  // 지난 달 총 조회수 계산
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear
  const lastMonthViews = posts.reduce((total, post) => {
    const postDate = new Date(post.date)
    if (postDate.getMonth() === lastMonth && postDate.getFullYear() === lastMonthYear) {
      return total + (viewCounts[post.id] || 0)
    }
    return total
  }, 0)
  
  // 전월 대비 증가율
  const growthRate = lastMonthViews > 0 
    ? Math.round(((monthlyViews - lastMonthViews) / lastMonthViews) * 100)
    : 0
  
  return {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    scheduledThisWeek: scheduledPosts.filter(s => {
      const date = new Date(s.date)
      return getWeekNumber(date) === thisWeek && s.status === 'pending'
    }).length,
    scheduledToday: scheduledPosts.filter(s => {
      const date = new Date(s.date)
      return date.toDateString() === today.toDateString() && s.status === 'pending'
    }).length,
    publishedThisMonth: posts.filter(p => {
      if (p.status !== 'published') return false
      const date = new Date(p.date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length,
    monthlyViews,
    growthRate
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7)
}

// 카테고리 관련 함수들
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  postCount?: number
}

const CATEGORY_KEY = 'blog_categories'

export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return []
  const categories = localStorage.getItem(CATEGORY_KEY)
  const savedCategories = categories ? JSON.parse(categories) : []
  
  // 기본 카테고리들
  const defaultCategories: Category[] = [
    { id: 'notion', name: '노션', slug: 'notion' },
    { id: 'obsidian', name: '옵시디언', slug: 'obsidian' },
    { id: 'cursor-ai', name: '커서 AI', slug: 'cursor-ai' },
    { id: 'claude-ai', name: '클로드 AI', slug: 'claude-ai' },
    { id: 'uncategorized', name: '미분류', slug: 'uncategorized' }
  ]
  
  // 저장된 카테고리가 없으면 기본 카테고리 반환
  if (savedCategories.length === 0) {
    const posts = getPosts()
    return defaultCategories.map(cat => ({
      ...cat,
      postCount: posts.filter(post => post.category === cat.slug).length
    }))
  }
  
  // 저장된 카테고리가 있으면 그대로 사용
  const posts = getPosts()
  return savedCategories.map((cat: Category) => ({
    ...cat,
    postCount: posts.filter(post => post.category === cat.slug).length
  }))
}

export const saveCategory = (category: Category) => {
  if (typeof window === 'undefined') return
  
  const categories = localStorage.getItem(CATEGORY_KEY)
  const savedCategories = categories ? JSON.parse(categories) : []
  
  // 기본 카테고리들
  const defaultCategories: Category[] = [
    { id: 'notion', name: '노션', slug: 'notion' },
    { id: 'obsidian', name: '옵시디언', slug: 'obsidian' },
    { id: 'cursor-ai', name: '커서 AI', slug: 'cursor-ai' },
    { id: 'claude-ai', name: '클로드 AI', slug: 'claude-ai' },
    { id: 'uncategorized', name: '미분류', slug: 'uncategorized' }
  ]
  
  // 모든 카테고리 병합
  const allCategories = [...defaultCategories]
  savedCategories.forEach((saved: Category) => {
    const existingIndex = allCategories.findIndex(cat => cat.id === saved.id)
    if (existingIndex >= 0) {
      allCategories[existingIndex] = saved
    } else {
      allCategories.push(saved)
    }
  })
  
  // 업데이트할 카테고리 찾기
  const existingIndex = allCategories.findIndex(c => c.id === category.id)
  if (existingIndex >= 0) {
    allCategories[existingIndex] = category
  } else {
    allCategories.push(category)
  }
  
  // 모든 카테고리를 저장 (기본 카테고리 포함)
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(allCategories))
}

export const deleteCategory = (categoryId: string) => {
  if (typeof window === 'undefined') return false
  
  // 미분류 카테고리는 삭제 불가 (최소 하나의 카테고리는 필요)
  if (categoryId === 'uncategorized') {
    return false
  }
  
  const categories = localStorage.getItem(CATEGORY_KEY)
  const savedCategories = categories ? JSON.parse(categories) : []
  
  // 카테고리 삭제
  const filtered = savedCategories.filter((c: Category) => c.id !== categoryId)
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(filtered))
  
  // 해당 카테고리의 포스트들을 미분류로 이동
  const posts = getPosts()
  posts.forEach(post => {
    if (post.category === categoryId) {
      post.category = 'uncategorized'
      savePost(post)
    }
  })
  
  return true
}