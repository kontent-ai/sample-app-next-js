import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { FC, useState } from "react";

import { ArticleItem } from "../../../../../components/listingPage/ArticleItem";
import { Content } from "../../../../../components/shared/Content";
import { useSiteCodename } from "../../../../../components/shared/siteCodenameContext";
import { AppPage } from "../../../../../components/shared/ui/appPage";
import { mainColorBgClass, mainColorBorderClass, mainColorHoverClass } from "../../../../../lib/constants/colors";
import { ArticlePageSize } from "../../../../../lib/constants/paging";
import { getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getItemByCodename, getItemsTotalCount, getSiteMenu } from "../../../../../lib/kontentClient";
import { pageCodenames } from "../../../../../lib/routing";
import { ValidCollectionCodename } from "../../../../../lib/types/perCollection";
import { ArticleListingUrlQuery, ArticleTypeWithAll, categoryFilterSource, isArticleType } from "../../../../../lib/utils/articlesListing";
import { siteCodename } from "../../../../../lib/utils/env";
import { Article, Block_Navigation, SEOMetadata, taxonomies, WSL_Page } from "../../../../../models";


type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  siteMenu: Block_Navigation | null,
  page: WSL_Page,
  itemCount: number;
  defaultMetadata: SEOMetadata;
}>;

type LinkButtonProps = {
  text: string;
  href: string;
  disabled?: boolean;
  roundRight?: boolean;
  roundLeft?: boolean;
  highlight?: boolean;
}

type FilterOptionProps = Readonly<{
  options: Record<string, string>;
  router: NextRouter;
}>;

const LinkButton: FC<LinkButtonProps> = props => {
  const siteCodename = useSiteCodename();

  return (
    <Link
      scroll={false}
      href={props.disabled ? '/articles' : props.href}
      className="h-full"
    >
      <button
        disabled={props.disabled}
        className={`${props.roundRight && 'rounded-r-lg'} ${props.roundLeft && 'rounded-l-lg'} disabled:cursor-not-allowed ${props.highlight ? mainColorBgClass[siteCodename] : 'bg-white'} px-3 py-2 leading-tight text-gray-500 border disabled:bg-gray-200 border-gray-300 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 `}
      >
        {props.text}
      </button>
    </Link>
  )
}

const getFilterOptions = () =>
  Object.fromEntries(Object.entries(taxonomies.article_type.terms).map(([codename, obj]) => [codename, obj.name]));

const FilterOptions: FC<FilterOptionProps> = ({ options, router }) => {
  const category = router.query.category;
  const [dropdownActive, setDropdownActive] = useState(false);
  const siteCodename = useSiteCodename();

  return (
    <>
      <div className="md:hidden flex items-center mt-3">
        <button
          type="button"
          className="w-screen flex items-center py-1 px-6"
          onClick={() => setDropdownActive(!dropdownActive)}
        >
          <ChevronDownIcon className={`w-6 h-full transform ${dropdownActive ? "rotate-180" : ""}`} />
          <span className="font-semibold pb-1 pl-1">Category</span>
        </button>
      </div>
      <div
        className={`${dropdownActive ? "flex" : "hidden"} absolute md:static w-full z-40 flex-col md:flex md:flex-row md:pt-10`}
      >
        {Object.entries(options).map(([key, value]) => (
          <Link
            key={key}
            href={`/articles/category/${key}`}
            onClick={() => setDropdownActive(!dropdownActive)}
            scroll={false}
            className={`inline-flex items-center z-40 md:justify-between md:mr-4 md:w-max px-6 py-1 no-underline ${key === category ? [mainColorBgClass[siteCodename], mainColorBorderClass[siteCodename], "cursor-default"].join(" ") : `border-gray-200 bg-white ${mainColorHoverClass[siteCodename]} cursor-pointer`} md:rounded-3xl`}
          >{value}
          </Link>
        ))}
        <Link
          href="/articles"
          onClick={() => setDropdownActive(!dropdownActive)}
          scroll={false}
          className={`px-6 py-1 ${category === "all" ? "hidden" : ""} bg-gray-500 text-white no-underline font-bold md:rounded-3xl cursor-pointer`}
        >Clear
        </Link>
      </div>
    </>
  );
};

const ArticlesPage: FC<Props> = props => {
  const router = useRouter();
  const page = typeof router.query.page === 'string' ? +router.query.page : undefined;
  const category = typeof router.query.category === 'string' ? router.query.category : "all";
  const filterOptions = getFilterOptions();
  const getFilteredArticles = () => {
    if (category === 'all') {
      return props.articles;
    } else {
      return props.articles.filter(
        article => article.elements.articleType.value.some(type => type.codename === category)
      );
    }
  };

  const filteredArticles = getFilteredArticles();
  const pageCount = Math.ceil(props.itemCount / ArticlePageSize);

  const createPagingButtonLink = (pageNumber: number) => {
    if(pageNumber > 1) {
      return `/articles/category/${category}/page/${pageNumber}`
    }

    return category === 'all' ? '/articles' : `/articles/category/${category}`
  }

  return (
    <AppPage
      siteCodename={props.siteCodename}
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={props.page}
      pageType="WebPage"
    >
      {props.page.elements.content.linkedItems.map(piece => (
        <Content
          key={piece.system.id}
          item={piece as any}
        />
      ))}
      <div className="md:px-4">
        <h2 className="mt-4 px-6 md:px-0 md:mt-16">Latest Articles</h2>
        <FilterOptions
          options={filterOptions}
          router={router}
        />
        <div className="flex flex-col flex-grow min-h-[500px]">
          {filteredArticles.length > 0 ? (
            <ul className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 place-items-center list-none gap-5 md:pt-4 pl-0 justify-center">
              {filteredArticles.map(article => (
                article.elements.articleType.value[0]?.codename && (
                  <ArticleItem
                    key={article.system.id}
                    title={article.elements.title.value}
                    itemId={article.system.id}
                    description={article.elements.abstract.value}
                    imageUrl={article.elements.heroImage.value[0]?.url || ""}
                    publisingDate={article.elements.publishingDate.value}
                    detailUrl={`/articles/${article.elements.slug.value}`}
                  />
                )
              ))}
            </ul>
          )
            :
            <div className="w-full flex my-auto grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-4 pl-0 justify-center font-bold">No articles match this criteria.</div>
          }

          {pageCount > 1 && (
            <nav>
              <ul className="mr-14 sm:mr-0 flex flex-row flex-wrap list-none justify-center">
                <li>
                  <LinkButton
                    text="Previous"
                    href={createPagingButtonLink((page ?? 0) - 1)}
                    disabled={!page}
                    roundLeft
                  />

                </li>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <li key={i}>
                    <LinkButton
                      text={`${i + 1}`}
                      href={createPagingButtonLink(i + 1)}
                      highlight={(page ?? 1) === i + 1}
                    />
                  </li>
                ))}
                <li>
                  <LinkButton
                    text="Next"
                    href={`/articles/category/${category}/page/${page ? page + 1 : 2}`}
                    disabled={(page ?? 1) === pageCount}
                    roundRight
                  />
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </AppPage>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const getAllPagesForCategory = async (category: ArticleTypeWithAll) => {
    const totalCount = category === 'all' ? await getItemsTotalCount(false, 'article') : await getArticlesCountByCategory(false, category);
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map((_, index) => index + 1);
    return pages.map(pageNumber => ({
      params: { envId: 'b0255462-358c-007b-0be0-43ee125ce1f0', page: pageNumber.toString(), category },
    }));
  };

  const paths = await Promise.all(categoryFilterSource.map(category => getAllPagesForCategory(category)))
    .then(categoryPaths => categoryPaths.flat());

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, ArticleListingUrlQuery> = async context => {
  const pageCodename = pageCodenames.articles;
  const envId = context.params?.envId;

  if(!envId){
    return {
      notFound: true
    }
  }

  const pageURLParameter = context.params?.page;
  const selectedCategory = context.params?.category;
  if (!isArticleType(selectedCategory)) {
    return {
      notFound: true
    };
  }

  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;
  const articles = await getArticlesForListing(envId as string, !!context.preview, pageNumber, selectedCategory);
  const siteMenu = await getSiteMenu(envId as string, !!context.preview);
  const page = await getItemByCodename<WSL_Page>(pageCodename, envId as string, !!context.preview);
  const itemCount = await getArticlesCountByCategory(false, selectedCategory, envId as string)
  const defaultMetadata = await getDefaultMetadata(envId as string, !!context.preview);

  if (page === null) {
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

export default ArticlesPage;
