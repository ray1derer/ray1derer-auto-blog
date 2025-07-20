import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PostStatus } from '@prisma/client'

// GET /api/posts - Get all posts with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (status) {
      where.status = status.toUpperCase() as PostStatus
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          platforms: {
            include: {
              platform: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        tags: post.tags.map(t => t.tag.name),
        platforms: post.platforms.map(p => ({
          id: p.platform.slug,
          name: p.platform.name,
          status: p.status
        }))
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      description,
      categoryId,
      status = 'DRAFT',
      tags = [],
      platforms = [],
      scheduledAt
    } = body

    // TODO: Get userId from session
    const userId = 'temp-user-id' // Replace with actual auth

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        slug,
        status: status as PostStatus,
        categoryId,
        authorId: userId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: {
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                }
              }
            }
          }))
        },
        platforms: {
          create: platforms.map((platformSlug: string) => ({
            platform: {
              connect: { slug: platformSlug }
            }
          }))
        }
      },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true
          }
        },
        platforms: {
          include: {
            platform: true
          }
        }
      }
    })

    return NextResponse.json({
      ...post,
      tags: post.tags.map(t => t.tag.name),
      platforms: post.platforms.map(p => p.platform.slug)
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}