import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: "Zephyr's Lab",
    description: 'Notes on agents, kernels, and the systems in between.',
    site: context.site,
    items: posts
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => {
        const legacyGuid = post.data.legacyPath
          ? new URL(post.data.legacyPath, context.site).href
          : undefined;

        return {
          title: post.data.title,
          pubDate: post.data.pubDate,
          description: post.data.description || '',
          link: `/posts/${post.id}/`,
          customData: legacyGuid
            ? `<guid isPermaLink="true">${legacyGuid}</guid>`
            : undefined,
        };
      }),
  });
}
