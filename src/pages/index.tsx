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
  // const posts = postsPagination.results;
  
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
          {/* {posts.map(post => ( */}
            <Link href={`/post/1`}>
              <a key={`1`}>
                <strong>Como utilizar Hooks</strong>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div>
                  <span>
                    <FiCalendar />
                    <time>15 Mar 2021</time>
                  </span>
                  <span>
                    <FiUser />
                    <small>Thales Testoni</small>
                  </span>
                </div>
              </a>
            </Link>

            <Link href={`/post/1`}>
              <a key={`2`}>
                <strong>Como utilizar Hooks</strong>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div>
                  <span>
                    <FiCalendar />
                    <time>15 Mar 2021</time>
                  </span>
                  <span>
                    <FiUser />
                    <small>Thales Testoni</small>
                  </span>
                </div>
              </a>
            </Link>

            <Link href={`/post/1`}>
              <a key={`3`}>
                <strong>Como utilizar Hooks</strong>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div>
                  <span>
                    <FiCalendar />
                    <time>15 Mar 2021</time>
                  </span>
                  <span>
                    <FiUser />
                    <small>Thales Testoni</small>
                  </span>
                </div>
              </a>
            </Link>
          {/* ))} */}
        </div>
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

  const posts = response.results.map(post => {
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
    }
  }
};
