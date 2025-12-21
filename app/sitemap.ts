import { MetadataRoute } from 'next';
import { mockInfluencers } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://faneasy.kr';

  // Base routes
  const routes = [
    '',
    '/login',
    '/admin/influencer',
    '/admin/fan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Creator specific routes (subdomains)
  // In a real app with subdomains, you might need a different strategy, 
  // but for sitemap we list the main ones.
  const creatorRoutes = mockInfluencers.map((creator) => ({
    url: `${baseUrl}/sites/${creator.subdomain}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...creatorRoutes];
}
