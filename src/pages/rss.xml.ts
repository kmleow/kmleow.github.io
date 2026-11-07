import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('blog');
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Leow Kah Man | Systems & Engineering Leadership Tech Blog',
    description: 'Architectural deep-dives into scalable cloud systems, resilient infrastructure, edge security, and disciplined software craftsmanship by Leow Kah Man.',
    site: context.site || 'https://www.leowkahman.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.id || post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: `<language>en-us</language>`,
  });
}
