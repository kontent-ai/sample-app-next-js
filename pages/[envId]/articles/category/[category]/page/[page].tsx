import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { GetStaticProps } from "next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { FC, useState } from "react";

import { ArticleItem } from "../../../../../../components/listingPage/ArticleItem";
import { Content } from "../../../../../../components/shared/Content";
import { AppPage } from "../../../../../../components/shared/ui/appPage";
import { mainColorBgClass, mainColorBorderClass, mainColorHoverClass } from "../../../../../../lib/constants/colors";
import { ArticlePageSize } from "../../../../../../lib/constants/paging";
import { getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getItemBySlug, getItemsTotalCount, getSiteMenu } from "../../../../../../lib/kontentClient";
import { ResolutionContext, resolveUrlPath } from "../../../../../../lib/routing";
import { ArticleListingUrlQuery, ArticleTypeWithAll, categoryFilterSource, isArticleType } from "../../../../../../lib/utils/articlesListing";
import { CircularReferenceInfo, sanitizeCircularData } from "../../../../../../lib/utils/circularityUtils";
import { defaultEnvId, siteCodename } from "../../../../../../lib/utils/env";
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from "../../../../../../lib/utils/pageUtils";
import { Article, contentTypes, Metadata, Nav_NavigationItem, taxonomies, WSL_Page } from "../../../../../../models";

type Props = Readonly<{
  articles: ReadonlyArray<Article>;
  siteMenu: Nav_NavigationItem | null,
  page: WSL_Page,
  itemCount: number;
  defaultMetadata: Metadata;
  circularReferences: Record<string, CircularReferenceInfo[]>;
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

const LinkButton: FC<LinkButtonProps> = props => (
  <Link
    scroll={false}
    href={props.disabled ? resolveUrlPath({
      type: "article",
      term: "all"
    }) : props.href}
    className="h-full"
  >
    <button
      disabled={props.disabled}
      className={`${props.roundRight && 'rounded-r-lg'} ${props.roundLeft && 'rounded-l-lg'} disabled:cursor-not-allowed ${props.highlight ? `${mainColorBgClass[siteCodename]} text-white` : 'bg-white'} px-3 py-2 leading-tight text-gray-500 border disabled:bg-gray-200 border-gray-300 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 `}
    >
      {props.text}
    </button>
  </Link>
);

const getFilterOptions = () =>
  Object.fromEntries(Object.entries(taxonomies.article_type.terms).map(([codename, obj]) => [codename, obj.name]));

const FilterOptions: FC<FilterOptionProps> = ({ options, router }) => {
  const category = router.query.category;
  const [dropdownActive, setDropdownActive] = useState(false);

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
            href={resolveUrlPath({
              type: "article",
              term: key
            } as ResolutionContext)}
            onClick={() => setDropdownActive(!dropdownActive)}
            scroll={false}
            className={`inline-flex items-center z-40 md:justify-between md:mr-4 md:w-max px-6 py-1 no-underline ${key === category ? [mainColorBgClass[siteCodename], mainColorBorderClass[siteCodename], "text-white", "cursor-default"].join(" ") : `border-gray-200 bg-white ${mainColorHoverClass[siteCodename]} hover:text-white cursor-pointer`} md:rounded-3xl`}
          >{value}
          </Link>
        ))}
        <Link
          href={resolveUrlPath({
            type: "article",
            term: "all"
          })}
          onClick={() => setDropdownActive(!dropdownActive)}
          scroll={false}
          className={`px-6 py-1 ${category === "all" ? "hidden" : ""} bg-gray-500 text-white no-underline font-bold md:rounded-3xl cursor-pointer`}
        >Clear
        </Link>
      </div>
    </>
  );
};

const ArticlesPagingPage: FC<Props> = props => {
  const router = useRouter();
  const page = typeof router.query.page === 'string' ? +router.query.page : undefined;
  const category = typeof router.query.category === 'string' ? router.query.category : "all";
  const filterOptions = getFilterOptions();

  const pageCount = Math.ceil(props.itemCount / ArticlePageSize);

  return (
    <AppPage
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={props.page}
      pageType="WebPage"
      circularReferences={props.circularReferences}
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
          {props.articles.length > 0 ? (
            <ul className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 place-items-center list-none gap-5 md:pt-4 pl-0 justify-center">
              {props.articles.map(article => (
                article.elements.type.value[0]?.codename && (
                  <ArticleItem
                    key={article.system.id}
                    title={article.elements.title.value}
                    itemId={article.system.id}
                    description={article.elements.abstract.value}
                    imageUrl={article.elements.heroImage.value[0]?.url || ""}
                    publishingDate={article.elements.publishingDate.value}
                    detailUrl={resolveUrlPath({
                      type: "article",
                      slug: article.elements.slug.value
                    })}
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
                    href={!page || page === 2
                      ? resolveUrlPath({
                        type: "article",
                        term: "all"
                      })
                      : resolveUrlPath({
                        type: "article",
                        term: category,
                        page: page - 1
                      } as ResolutionContext)}
                    disabled={page === 1}
                    roundLeft
                  />

                </li>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <li key={i}>
                    <LinkButton
                      text={`${i + 1}`}
                      href={resolveUrlPath({
                        type: "article",
                        term: category,
                        page: i + 1 > 1 ? i + 1 : undefined
                      } as ResolutionContext)}
                      highlight={(page ?? 1) === i + 1}
                    />
                  </li>
                ))}
                <li>
                  <LinkButton
                    text="Next"
                    href={resolveUrlPath({
                      type: "article",
                      term: category,
                      page: page ? page + 1 : 2
                    } as ResolutionContext)}
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

export const getStaticPaths = async () => {
  const getAllPagesForCategory = async (category: ArticleTypeWithAll) => {
    const totalCount = category === 'all'
      ? await getItemsTotalCount({ envId: defaultEnvId }, false, contentTypes.article.codename)
      : await getArticlesCountByCategory({ envId: defaultEnvId }, false, category);
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map((_, index) => index + 1);
    return pages.map(pageNumber => ({
      params: { page: pageNumber.toString(), category, envId: defaultEnvId },
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
  const envId = getEnvIdFromRouteParams(context);

  const pageURLParameter = context.params?.page;
  const selectedCategory = context.params?.category;
  if (!isArticleType(selectedCategory)) {
    return {
      notFound: true
    };
  }

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;
  const articlesData = await getArticlesForListing({ envId, previewApiKey }, !!context.preview, pageNumber, selectedCategory);
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const pageData = await getItemBySlug<WSL_Page>({ envId, previewApiKey }, "articles", contentTypes.page.codename, !!context.preview);
  const itemCount = await getArticlesCountByCategory({ envId, previewApiKey }, !!context.preview, selectedCategory)
  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, !!context.preview);

  if (pageData === null) {
    return { notFound: true };
  }

  if (!siteMenuData) {
    throw new Error("Can't find main menu item.");
  }

  const [siteMenu, siteMenuFoundCycles] = sanitizeCircularData(siteMenuData);
  const [page, pageFoundCycles] = sanitizeCircularData(pageData);

  let articlesFoundCycles: Record<string, CircularReferenceInfo[]> = {};

  const articles = {
    ...articlesData,
    items: articlesData.items.map(product => {
      const [sanitizedArticle, foundCycles] = sanitizeCircularData(product);
      articlesFoundCycles = {...articlesFoundCycles, ...foundCycles};
      return sanitizedArticle;
    })
  }

  const circularReferences = {...siteMenuFoundCycles, ...articlesFoundCycles, ...pageFoundCycles};

  return {
    props: {
      articles: articles.items,
      siteMenu,
      page,
      itemCount,
      defaultMetadata,
      circularReferences
    },
    revalidate: 10,
  };
};

export default ArticlesPagingPage;
