import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleNextPage() {
    const response = await fetch(nextPage)
      .then(response => response.json()
      .then((data: ApiSearchResponse) => data));

    const postsNextPage: Post[] = response.results.map(post => ({
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date), 
        'dd MMM yyyy', 
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      } 
    }));

    setPosts([...posts, ...postsNextPage]);
    setNextPage(response.next_page);
  }
  
  return (
    <>
      <Head>
        <title>Home | spacetraveling.</title>
      </Head>

      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Image
            src="/images/logo.svg"
            alt="logo"
            height={27}
            width={239}
          />
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`}>
              <a key={post.uid}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div>
                  <span>
                    <FiCalendar />
                    <time>{post.first_publication_date}</time>
                  </span>
                  <span>
                    <FiUser />
                    <small>{post.data.author}</small>
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
        { nextPage && (
           <button className={styles.loadMorePosts} onClick={handleNextPage}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { 
      pageSize: 5,
      fetch: ['post.title', 'post.subtitle', 'post.author'] 
    }
  );

  const posts: Post[] = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date), 
        'dd MMM yyyy', 
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts
      }
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
};
