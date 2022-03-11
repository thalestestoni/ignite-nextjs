import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import Head from 'next/head';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
    banner: {
      url: string;
    };
    content: {
      heading: string;
      body: {
        text: string;
        type: string;
        spans: [];
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  const amountWordsInPost = post.data.content.reduce((previousValue, currentValue) => {
    var amountWordsInHead = currentValue.heading.split(' ').length;
    var amountWordsInBody = RichText.asText(currentValue.body).split(' ').length;
    
    return previousValue + amountWordsInHead + amountWordsInBody;
  }, 0);

  var averageWordsReadByMinute = 200; // 200 is average words quantity that a human read by minute

  var readTime = Math.round(amountWordsInPost / averageWordsReadByMinute);

  return (
    <>
      <Head>
        <title>spacetraveling.</title>
      </Head>

      <Header />

      <div className={styles.bannerContainer}>
        <img src={post.data.banner.url} alt="" />
      </div>

      <main className={styles.contentContainer}>
        <article>
          <header className={styles.postHeader}>
            <strong>{post.data.title}</strong>
            <div>
              <span>
                <FiCalendar />
                <time>{post.first_publication_date}</time>
              </span>
              <span>
                <FiUser />
                <small>{post.data.author}</small>
              </span>
              <span>
                <FiClock />
                <small>4 min</small>
              </span>
            </div>
          </header>
          <div className={styles.postContentContainer}>
            {post.data.content.map(content => (
              <>
                <strong>{content.heading}</strong>
                {content.body.map(body => (
                  <p>{body.text}</p>
                ))}
              </>
            ))}
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { 
      pageSize: 5,
      fetch: 'post.uid'
    }
  );
  
  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid
    }
  }));

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const uid = String(Object.keys(params));

  const response: Post = await prismic.getByUID('post', uid, {});

  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date), 
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url
      },
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body
      }))
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
};
