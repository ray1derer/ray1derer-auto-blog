import { NextRequest, NextResponse } from 'next/server';
import { fetchAINews, fetchAINewsBySource, searchAINews } from '@/lib/ai-news-fetcher';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const refresh = searchParams.get('refresh') === 'true';
    
    let news;
    
    if (source) {
      // Get news from specific source
      news = await fetchAINewsBySource(source);
    } else if (search) {
      // Search news by keyword
      news = await searchAINews(search);
    } else {
      // Get all news (use cache unless refresh is requested)
      news = await fetchAINews(!refresh);
    }
    
    return NextResponse.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI news API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}