import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';


import styles from './styles.module.scss';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

interface IPost {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}
interface PostsProps {
  posts: IPost[]
}

export default function Posts({ posts }: PostsProps) {
  const [ session ] = useSession();

  return (
    <>
      <Head>
        <title>POSTS | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={
              session?.activeSubscription 
              ? `/posts/${post.slug}` 
              : `/posts/preview/${post.slug}`
            } key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  });

  const posts = response.results.map(post => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
    updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }));

  return {
    props: {
      posts
    }
  }
}