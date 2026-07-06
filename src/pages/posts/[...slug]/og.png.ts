import satori from 'satori';
import sharp from 'sharp';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { readFileSync } from 'fs';
import { join } from 'path';

const inter400 = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
);
const inter700 = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
);
const mono400 = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff')
);

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      params: { slug: post.id },
      props: { post },
    }));
}

export async function GET({ props }: { props: { post: CollectionEntry<'posts'> } }) {
  const { post } = props;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#08090A',
          color: '#F7F8F8',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: '24px', color: '#5E6AD2', fontFamily: 'JetBrains Mono', marginBottom: '32px' },
              children: '$ zephyr.lab',
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '48px', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' },
              children: post.data.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#8A8F98',
                marginTop: '24px',
                fontFamily: 'JetBrains Mono',
              },
              children: `[${post.data.category}] · ${post.data.pubDate.toISOString().split('T')[0]}`,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: inter400, style: 'normal', weight: 400 },
        { name: 'Inter', data: inter700, style: 'normal', weight: 700 },
        { name: 'JetBrains Mono', data: mono400, style: 'normal', weight: 400 },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
