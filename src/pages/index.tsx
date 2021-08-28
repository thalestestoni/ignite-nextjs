import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
