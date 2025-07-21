import { generateMainRSS } from '@/lib/rss-generator'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  
  try {
    const rssXml = generateMainRSS(origin)
    
    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('RSS generation error:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}