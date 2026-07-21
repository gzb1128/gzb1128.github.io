import { getCollection } from 'astro:content';

export { GET } from '../../[...slug]/og.png';

export async function getStaticPaths() {
  const posts = await getCollection('posts');

  return posts.flatMap((post) => {
    const legacyPath = post.data.legacyPath;
    if (!legacyPath) return [];

    const slug = legacyPath.split('/').filter(Boolean).at(-1);
    if (!slug) return [];

    return [{
      params: { slug },
      props: { post },
    }];
  });
}
