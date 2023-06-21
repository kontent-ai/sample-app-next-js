import { FC } from "react";
import { Article, Block_Navigation, WSL_Page, contentTypes } from "../../../models";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getItemsCount, getArticlesForListing, getItemByCodename, getSiteMenu } from "../../../lib/kontentClient";
import { siteCodename } from "../../../lib/utils/env";
import { PerCollectionCodenames } from "../../../lib/routing";
import ArticlesPage from "..";
import { ArticlePageSize } from "../../../lib/constants/page";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu?: Block_Navigation,
  page: WSL_Page,
  totalCount: number | null
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

  if (pageNumber === 1 || pageNumber === 0) {
    return {
      redirect: {
        destination: '/articles',
        permanent: true,
      },
    }
  }

  const articles = await getArticlesForListing(!!context.preview, pageNumber);
  const siteMenu = await getSiteMenu(!!context.preview);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);

  if (page === null || articles.items.length === 0) {
    return { notFound: true };
  };

  return {
    props: {
      articles: articles.items,
      siteCodename,
      siteMenu,
      page,
      totalCount: articles.pagination.totalCount
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const totalCount = await getItemsCount(false, contentTypes.article.codename);
  const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);

  const getNextPagesRange = (lastPage: number, firstPage: number = 2) => {
    if (firstPage < 1 || lastPage < firstPage) {
      return [];
    }

    const rangeLength = lastPage - firstPage + 1; // for lastPage = 3 and firstPage = 2 => [2, 3]

    return Array.from({ length: rangeLength }).map((_, index) => index + firstPage)
  }

  return {
    // pre-generates all the pages for paging.
    paths: getNextPagesRange(pagesNumber).map(pageNumber => ({ params: { page: pageNumber.toString() } })),
    fallback: 'blocking',
  }
}

export default ArticlesPagingPage;