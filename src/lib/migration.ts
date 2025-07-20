import { prisma } from './db'
import { getPosts, getCategories, getScheduledPosts, getPlatformConnections } from './storage'
import { PostStatus, Role, PublicationStatus } from '@prisma/client'

// Migration script to move from localStorage to PostgreSQL
export async function migrateDataToDatabase() {
  console.log('🚀 Starting data migration from localStorage to PostgreSQL...')
  
  try {
    // 1. Create default admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ray1derer.com' },
      update: {},
      create: {
        email: 'admin@ray1derer.com',
        name: 'Admin',
        role: Role.ADMIN,
        password: '$2a$10$K8ZpdrjrLkPw5w8H.FvFkO6HpGX7lqPNVf3lJmlD0h8OJU0RcRtQm' // Default: admin123
      }
    })
    console.log('✅ Admin user created/verified')

    // 2. Migrate categories
    const localCategories = getCategories()
    const categoryMap = new Map<string, string>()
    
    for (const cat of localCategories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          isSystem: ['uncategorized', 'notion', 'obsidian', 'cursor-ai', 'claude-ai'].includes(cat.id)
        }
      })
      categoryMap.set(cat.id, category.id)
    }
    console.log(`✅ ${localCategories.length} categories migrated`)

    // 3. Create default platforms
    const defaultPlatforms = [
      { name: '티스토리', slug: 'tistory' },
      { name: '네이버 블로그', slug: 'naver' },
      { name: '브런치', slug: 'brunch' },
      { name: '워드프레스', slug: 'wordpress' },
      { name: '미디엄', slug: 'medium' },
      { name: '벨로그', slug: 'velog' }
    ]
    
    for (const platform of defaultPlatforms) {
      await prisma.platform.upsert({
        where: { slug: platform.slug },
        update: {},
        create: platform
      })
    }
    console.log('✅ Platforms created')

    // 4. Migrate posts
    const localPosts = getPosts()
    const postMap = new Map<string, string>()
    
    for (const post of localPosts) {
      const categoryId = categoryMap.get(post.category) || categoryMap.get('uncategorized')!
      
      const newPost = await prisma.post.create({
        data: {
          title: post.title,
          content: post.content,
          description: post.description,
          slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: post.status.toUpperCase() as PostStatus,
          publishedAt: post.status === 'published' ? new Date(post.date) : null,
          scheduledAt: post.scheduledDate ? new Date(`${post.scheduledDate}T${post.scheduledTime || '00:00'}`) : null,
          categoryId,
          authorId: adminUser.id,
          tags: {
            create: post.tags?.map(tagName => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: {
                    name: tagName,
                    slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  }
                }
              }
            })) || []
          }
        }
      })
      postMap.set(post.id, newPost.id)
    }
    console.log(`✅ ${localPosts.length} posts migrated`)

    // 5. Migrate scheduled posts
    const scheduledPosts = getScheduledPosts()
    for (const scheduled of scheduledPosts) {
      const postId = postMap.get(scheduled.postId)
      if (!postId) continue
      
      // Update post scheduled time
      await prisma.post.update({
        where: { id: postId },
        data: {
          scheduledAt: new Date(`${scheduled.date}T${scheduled.time}`),
          status: PostStatus.SCHEDULED
        }
      })
      
      // Create platform publications
      for (const platformSlug of scheduled.platforms) {
        const platform = await prisma.platform.findUnique({
          where: { slug: platformSlug }
        })
        
        if (platform) {
          await prisma.platformPublication.create({
            data: {
              postId,
              platformId: platform.id,
              status: scheduled.status === 'published' ? PublicationStatus.PUBLISHED : PublicationStatus.PENDING
            }
          })
        }
      }
    }
    console.log(`✅ ${scheduledPosts.length} scheduled posts migrated`)

    // 6. Migrate platform connections
    const connections = getPlatformConnections()
    for (const conn of connections) {
      const platform = await prisma.platform.findUnique({
        where: { slug: conn.id }
      })
      
      if (platform) {
        await prisma.platformConnection.create({
          data: {
            platformId: platform.id,
            userId: adminUser.id,
            username: conn.username,
            isActive: conn.status === 'connected'
          }
        })
      }
    }
    console.log(`✅ ${connections.length} platform connections migrated`)

    console.log('🎉 Migration completed successfully!')
    return true
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return false
  }
}