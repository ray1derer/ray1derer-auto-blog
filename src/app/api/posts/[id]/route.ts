import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PostStatus } from '@prisma/client'

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
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
        },
        media: true
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.post.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({
      ...post,
      tags: post.tags.map(t => t.tag.name),
      platforms: post.platforms.map(p => ({
        id: p.platform.slug,
        name: p.platform.name,
        status: p.status,
        url: p.url
      }))
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      description,
      categoryId,
      status,
      tags = [],
      platforms = [],
      scheduledAt
    } = body

    // Delete existing tags and platforms
    await prisma.tagsOnPosts.deleteMany({
      where: { postId: params.id }
    })

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        description,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: status as PostStatus,
        categoryId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
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

    // Update platform publications
    for (const platformSlug of platforms) {
      const platform = await prisma.platform.findUnique({
        where: { slug: platformSlug }
      })
      
      if (platform) {
        await prisma.platformPublication.upsert({
          where: {
            postId_platformId: {
              postId: params.id,
              platformId: platform.id
            }
          },
          create: {
            postId: params.id,
            platformId: platform.id
          },
          update: {}
        })
      }
    }

    return NextResponse.json({
      ...post,
      tags: post.tags.map(t => t.tag.name),
      platforms: post.platforms.map(p => p.platform.slug)
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}