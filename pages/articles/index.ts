import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

const RedirectToArticles: NextPage = () => {
  const router = useRouter();

  return null;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: '/articles/category/all',
      permanent: true
    },
  };
};

export default RedirectToArticles;
