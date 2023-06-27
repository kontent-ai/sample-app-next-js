import { FC } from "react";
import { Article, ArticleType, Block_Navigation, ProductCategory, WSL_Page, contentTypes } from "../../../../../models";
import { ValidCollectionCodename } from "../../../../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getItemsCount, getArticlesForListing, getItemByCodename, getSiteMenu, getArticlesCountByCategory } from "../../../../../lib/kontentClient";
import { siteCodename } from "../../../../../lib/utils/env";
import { PerCollectionCodenames } from "../../../../../lib/routing";
import ArticlesPage from "..";
import { ArticlePageSize } from "../../../../../lib/constants/paging";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu?: Block_Navigation,
  page: WSL_Page,
  itemCount: number
}>;

const ArticlesPagingPage: FC<Props> = props => {
  return <ArticlesPage {...props} />
}

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    ficto_healthtech: "articles",
    ficto_healthtech_imaging: null,
    ficto_healthtech_surgical: "articles"
  };

  const pageURLParameter = context.params?.page;
  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;

  if (pageNumber < 0) {
    return { notFound: true }
  }

  // if (pageNumber === 1 || pageNumber === 0) {
  //   return {
  //     redirect: {
  //       destination: `/articles`,
  //       permanent: true,
  //     },
  //   }
  // }

  const articles = await getArticlesForListing(!!context.preview, pageNumber, context.params?.category as string ?? 'all');
  const siteMenu = await getSiteMenu(!!context.preview);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);
  const itemCount = await getArticlesCountByCategory(false, context.params?.category as string)

  if (page === null || articles.items.length === 0) {
    return { notFound: true };
  };

  return {
    props: {
      articles: articles.items,
      siteCodename,
      siteMenu,
      page,
      itemCount
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const categories: string[] = ['all', 'case_study', 'clinical_trial', 'industry_news', 'research'];

  const getAllPagesForCategory = async (category: string) => {
    const totalCount = category === 'all' ? await getItemsCount(false, 'article') : await getArticlesCountByCategory(false, category);
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map((_, index) => index + 1);
    return pages.map(pageNumber => ({
      params: { page: pageNumber.toString(), category },
    }));
  };

  const paths = await Promise.all(categories.map(category => getAllPagesForCategory(category)))
    .then(categoryPaths => categoryPaths.flat());
  return {
    paths,
    fallback: 'blocking',
  };
};


export default ArticlesPagingPage;