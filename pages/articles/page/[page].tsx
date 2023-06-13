import { FC } from "react";
import { Article, Block_Navigation, WSL_Page } from "../../../models";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { GetStaticProps } from "next";
import { getArticlesForListing, getItemByCodename, getSiteMenu } from "../../../lib/kontentClient";
import { siteCodename } from "../../../lib/utils/env";
import { PerCollectionCodenames } from "../../../lib/routing";
import ArticlesPage from "..";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu?: Block_Navigation,
  page: WSL_Page,
  totalCount: number | null
}>;

const ArticlesPagingPage: FC<Props> = props => {
  return <ArticlesPage {...props}/>
}

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename: PerCollectionCodenames = {
    ficto_healthtech: "articles",
    ficto_healthtech_imaging: "articles",
    ficto_healthtech_surgical: "articles"
  };

  const pageURLParameter = context.params?.page;
  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;

  const articles = await getArticlesForListing(!!context.preview, pageNumber);
  const siteMenu = await getSiteMenu(!!context.preview);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview);

  if (page === null) {
    return {
      notFound: true
    };
  };

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
      paths: Array.from({ length: 1 }).map((_, i) => ({params:{page: (i+2).toString()} })),
      fallback: 'blocking',
    }
  }

export default ArticlesPagingPage;