import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  description: string;
  date: string;
  source: string;
}

export async function getLiveNews(keyword: string): Promise<NewsItem[]> {
  try {
    // Encoded keyword for URL
    const encodedKeyword = encodeURIComponent(keyword);
    
    // Google News RSS Feed (Official & Public)
    const RSS_URL = `https://news.google.com/rss/search?q=${encodedKeyword}&hl=ko&gl=KR&ceid=KR:ko`;

    const response = await fetch(RSS_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const xmlText = await response.text();

    const parser = new XMLParser();
    const result = parser.parse(xmlText);

    const items = result.rss.channel.item || [];

    // Map and limit to top 5 news
    return (Array.isArray(items) ? items : [items]).slice(0, 5).map((item: any) => ({
      id: item.guid || item.link,
      title: item.title,
      url: item.link,
      description: item.description || "",
      date: new Date(item.pubDate).toLocaleDateString(),
      source: (typeof item.source === 'string' ? item.source : item.source?.['#text']) || "Google News"
    }));

  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
}
