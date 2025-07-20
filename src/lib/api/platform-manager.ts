// 플랫폼별 API 통합 관리자
export interface PlatformConfig {
  name: string
  enabled: boolean
  apiKey?: string
  apiUrl?: string
}

export interface PostData {
  title: string
  content: string
  category?: string
  tags?: string[]
  publishDate?: Date
}

export interface PublishResult {
  success: boolean
  platform: string
  url?: string
  error?: string
}

// 각 플랫폼별 Publisher 인터페이스
export interface PlatformPublisher {
  name: string
  publish(post: PostData): Promise<PublishResult>
  update(postId: string, post: PostData): Promise<PublishResult>
  delete(postId: string): Promise<boolean>
}

// 플랫폼 매니저 클래스
export class PlatformManager {
  private publishers: Map<string, PlatformPublisher> = new Map()
  
  register(publisher: PlatformPublisher) {
    this.publishers.set(publisher.name, publisher)
  }
  
  async publishToAll(post: PostData): Promise<PublishResult[]> {
    const results: PublishResult[] = []
    
    for (const [name, publisher] of this.publishers) {
      try {
        const result = await publisher.publish(post)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          platform: name,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return results
  }
  
  async publishToPlatform(platform: string, post: PostData): Promise<PublishResult> {
    const publisher = this.publishers.get(platform)
    
    if (!publisher) {
      return {
        success: false,
        platform,
        error: 'Platform not registered'
      }
    }
    
    return publisher.publish(post)
  }
}