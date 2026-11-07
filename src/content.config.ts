import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string(),
    heroAlt: z.string().default('Article thumbnail'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Leow Kah Man'),
    legacyUrls: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
