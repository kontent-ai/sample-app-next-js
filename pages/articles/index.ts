import { GetStaticProps, NextPage } from 'next';

const RedirectToArticles: NextPage = () => {
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
