import * as xml2js from 'xml2js';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  image?: string;
}

interface RSSFeed {
  url: string;
  name: string;
}

const RSS_FEEDS: RSSFeed[] = [
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    name: 'TechCrunch'
  },
  {
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    name: 'MIT Technology Review'
  },
  {
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    name: 'The Verge'
  },
  {
    url: 'https://venturebeat.com/ai/feed/',
    name: 'VentureBeat'
  }
];

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
let cachedData: { data: NewsItem[], timestamp: number } | null = null;

// Parse a single RSS feed
async function parseRSSFeed(feed: RSSFeed): Promise<NewsItem[]> {
  try {
    const response = await fetch(feed.url);
    const text = await response.text();
    
    const parser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: false
    });
    
    const result = await parser.parseStringPromise(text);
    const items: NewsItem[] = [];
    
    // Handle different RSS formats
    const channel = result.rss?.channel || result.feed;
    const entries = channel?.item || channel?.entry || [];
    
    // Ensure entries is always an array
    const entriesArray = Array.isArray(entries) ? entries : [entries];
    
    for (const entry of entriesArray) {
      // Skip if no title
      if (!entry.title) continue;
      
      // Extract data based on RSS format
      const title = typeof entry.title === 'string' ? entry.title : entry.title._;
      const link = entry.link?.$ ? entry.link.$.href : (entry.link || entry.guid);
      const description = entry.description || entry.summary || entry['content:encoded'] || '';
      const pubDate = entry.pubDate || entry.published || entry.updated || new Date().toISOString();
      
      // Try to extract image from various sources
      let image: string | undefined;
      if (entry['media:content']?.$.url) {
        image = entry['media:content'].$.url;
      } else if (entry.enclosure?.$.url && entry.enclosure.$.type?.startsWith('image/')) {
        image = entry.enclosure.$.url;
      } else if (entry['media:thumbnail']?.$.url) {
        image = entry['media:thumbnail'].$.url;
      }
      
      // Extract image from description if not found
      if (!image && description) {
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
          image = imgMatch[1];
        }
      }
      
      // Generate unique ID
      const id = `${feed.name}-${Buffer.from(link).toString('base64').substring(0, 10)}`;
      
      items.push({
        id,
        title: cleanText(title),
        description: cleanText(description),
        link,
        pubDate,
        source: feed.name,
        image
      });
    }
    
    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${feed.name}:`, error);
    return [];
  }
}

// Clean HTML and extract text
function cleanText(text: string): string {
  if (!text) return '';
  
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Trim and remove extra whitespace
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  return cleaned;
}

// Fetch all AI news from RSS feeds
export async function fetchAINews(useCache = true): Promise<NewsItem[]> {
  // Check cache
  if (useCache && cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  
  try {
    // Fetch all feeds in parallel
    const promises = RSS_FEEDS.map(feed => parseRSSFeed(feed));
    const results = await Promise.all(promises);
    
    // Combine all news items
    const allNews = results.flat();
    
    // Sort by publication date (newest first)
    allNews.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
    
    // Limit to 50 most recent items
    const limitedNews = allNews.slice(0, 50);
    
    // Update cache
    cachedData = {
      data: limitedNews,
      timestamp: Date.now()
    };
    
    return limitedNews;
  } catch (error) {
    console.error('Error fetching AI news:', error);
    
    // Return cached data if available, even if expired
    if (cachedData) {
      return cachedData.data;
    }
    
    return [];
  }
}

// Get news from a specific source
export async function fetchAINewsBySource(sourceName: string): Promise<NewsItem[]> {
  const allNews = await fetchAINews();
  return allNews.filter(item => item.source === sourceName);
}

// Search news by keyword
export async function searchAINews(keyword: string): Promise<NewsItem[]> {
  const allNews = await fetchAINews();
  const lowercaseKeyword = keyword.toLowerCase();
  
  return allNews.filter(item => 
    item.title.toLowerCase().includes(lowercaseKeyword) ||
    item.description.toLowerCase().includes(lowercaseKeyword)
  );
}