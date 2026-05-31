import { MetadataRoute } from 'next';
import { siteConfig } from "@/config/site";

const privatePaths = ['/api/', '/editor', '/en/editor', '/mijn-cvs', '/login', '/success'];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'Claude-SearchBot',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'Claude-User',
                allow: '/',
                disallow: privatePaths,
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: privatePaths,
            },
        ],
        sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    };
}
