import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: [
        { isSystem: 'desc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(
      categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isSystem: cat.isSystem,
        postCount: cat._count.posts
      }))
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isSystem: false
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description } = body

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID required' },
        { status: 400 }
      )
    }

    // Check if it's a system category
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    if (category.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system category' },
        { status: 403 }
      )
    }

    // Get uncategorized category
    const uncategorized = await prisma.category.findFirst({
      where: { slug: 'uncategorized' }
    })

    if (!uncategorized) {
      return NextResponse.json(
        { error: 'Uncategorized category not found' },
        { status: 500 }
      )
    }

    // Move all posts to uncategorized
    await prisma.post.updateMany({
      where: { categoryId: id },
      data: { categoryId: uncategorized.id }
    })

    // Delete the category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}