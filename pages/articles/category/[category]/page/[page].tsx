import { GetStaticProps } from "next";
import { FC } from "react";

import { ArticlePageSize } from "../../../../../lib/constants/paging";
import { getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getItemBySlug, getItemsTotalCount, getSiteMenu } from "../../../../../lib/kontentClient";
import { reservedListingSlugs } from "../../../../../lib/routing";
import { ValidCollectionCodename } from "../../../../../lib/types/perCollection";
import { ArticleListingUrlQuery, ArticleTypeWithAll, categoryFilterSource, isArticleType } from "../../../../../lib/utils/articlesListing";
import { siteCodename } from "../../../../../lib/utils/env";
import { Article, contentTypes,Metadata, Nav_NavigationItem, WSL_Page } from "../../../../../models";
import ArticlesPage from "..";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu: Nav_NavigationItem | null,
  page: WSL_Page,
  itemCount: number,
  defaultMetadata: Metadata;
}>;

const ArticlesPagingPage: FC<Props> = props => {
  return <ArticlesPage {...props} />
}

export const getStaticProps: GetStaticProps<Props, ArticleListingUrlQuery> = async context => {
  const pageURLParameter = context.params?.page;
  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;

  if (pageNumber <= 0) {
    return { notFound: true }
  }

  const selectedCategory = context.params?.category;
  if (!isArticleType(selectedCategory)) {
    return {
      notFound: true
    };
  }


  const articles = await getArticlesForListing(!!context.preview, pageNumber, context.params?.category ?? 'all');
  const siteMenu = await getSiteMenu(!!context.preview);
  const page = await getItemBySlug<WSL_Page>(reservedListingSlugs.articles, contentTypes.page.codename, !!context.preview);
  const itemCount = await getArticlesCountByCategory(!!context.preview, selectedCategory);
  const defaultMetadata = await getDefaultMetadata(!!context.preview);

  if (page === null || articles.items.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      articles: articles.items,
      siteCodename,
      siteMenu,
      page,
      itemCount,
      defaultMetadata
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const getAllPagesForCategory = async (category: ArticleTypeWithAll) => {
    const totalCount = category === 'all' ? await getItemsTotalCount(false, 'article') : await getArticlesCountByCategory(false, category);
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map((_, index) => index + 1);
    return pages.map(pageNumber => ({
      params: { page: pageNumber.toString(), category },
    }));
  };

  const paths = await Promise.all(categoryFilterSource.map(category => getAllPagesForCategory(category)))
    .then(categoryPaths => categoryPaths.flat());

  return {
    paths,
    fallback: 'blocking',
  };
};

export default ArticlesPagingPage;
