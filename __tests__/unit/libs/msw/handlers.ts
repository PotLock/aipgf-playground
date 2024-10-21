import { rest } from 'msw';

import setupEnv from '@tests/unit/setup/env';

setupEnv();

const handlers = [
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`, async (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 'company-1',
            slug: 'how-to-create-a-blog-with-next-js',
            name: 'How to create a blog with Next.js',
            description: 'Description',
            body: 'Content',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'company-2',
            slug: 'how-to-use-next-auth-with-next-js',
            name: 'How to use NextAuth with Next.js',
            description: 'Description',
            body: 'Content',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ] as unknown
      })
    );
  }),
  rest.get('https://jsonplaceholder.typicode.com/photos', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          albumId: 1,
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          url: 'https://via.placeholder.com/600/92c952',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        },
        {
          albumId: 1,
          id: 2,
          title: 'reprehenderit est deserunt velit ipsam',
          url: 'https://via.placeholder.com/600/771796',
          thumbnailUrl: 'https://via.placeholder.com/150/771796'
        }
      ])
    );
  })
];

export { handlers };
