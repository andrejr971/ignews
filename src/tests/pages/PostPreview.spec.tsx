import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');
jest.mock('next/router');

const posts = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: 'March, 10'
  };

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={posts} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to gull post when user is subcripted', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn();


    useSessionMocked.mockReturnValueOnce([{ activeSubscription: 'false-active' }, true] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<Post post={posts} />);

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  });
  
  
  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post'}
          ],
          content: [
            { type: 'paragraph', text: 'Post excerpt' }
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: { 
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post excerpt</p>',
            updatedAt: '01 de abril de 2021'
          },
        }
      })
    )
  });
});
