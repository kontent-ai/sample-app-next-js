import { FC } from "react";
import { Article, Block_Navigation, WSL_Page } from "../../../models";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getArticlesForListing, getItemByCodename, getSiteMenu } from "../../../lib/kontentClient";
import { siteCodename } from "../../../lib/utils/env";
import { PerCollectionCodenames } from "../../../lib/routing";
import ArticlesPage from "..";
import { ArticlePageSize, notFoundRedirect } from "../../../lib/constants/page";

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

  if (pageNumber < 1) {
    return notFoundRedirect;
  }

  if (pageNumber === 1) {
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

  if (page === null) {
    return notFoundRedirect;
  };

  const pageCount = Math.ceil((articles.pagination.totalCount ?? 0) / ArticlePageSize);
  
  if (pageNumber > pageCount) {
    return notFoundRedirect;
  }

  return {
    props: {
      articles: articles.items,
      siteCodename,
      siteMenu,
      page,
      totalCount: articles.pagination.totalCount
    },
  };
};

export const getStaticPaths = async () => {
  return {
    // index.tsx and page number 2 is generated statically
    // other pages are generated on request using ISR
    paths: (siteCodename === 'ficto_healthtech_surgical' ? [2] : []).map(pageNumber => ({ params: { page: pageNumber.toString() } })),
    fallback: 'blocking',
  }
}

export default ArticlesPagingPage;