import Head from "next/head";
import { FC, ReactNode } from "react";

import { perCollectionSEOTitle } from "../../../lib/constants/labels";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { useSmartLink } from "../../../lib/useSmartLink";
import { parseFlatted,Stringified } from "../../../lib/utils/circularityUtils";
import { siteCodename } from "../../../lib/utils/env";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { Article, contentTypes, Metadata, Nav_NavigationItem, Product, Solution, WSL_Page, WSL_WebSpotlightRoot } from "../../../models";
import { Footer } from "./footer";
import { Menu } from "./menu";

type AcceptedItem = WSL_WebSpotlightRoot | Article | Product | WSL_Page | Solution;

type Props = Readonly<{
  children: ReactNode;
  item: AcceptedItem;
  siteMenu: Stringified<Nav_NavigationItem>;
  defaultMetadata: Metadata;
  pageType: "WebPage" | "Article" | "Product" | "Solution",
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();
  const siteMenu = parseFlatted(props.siteMenu);

  return (
    <>
      <PageMetadata
        item={props.item}
        pageType={props.pageType}
        defaultMetadata={props.defaultMetadata}
      />
      <div className="min-h-full grow flex flex-col items-center overflow-hidden">
        <Menu item={siteMenu} />
        {/* https://tailwindcss.com/docs/typography-plugin */}
        <main
          className="grow h-full w-screen bg-slate-50 scroll-smooth"
          {...createItemSmartLink(props.item.system.id, true)}
        >
          <div className="prose w-full max-w-screen-xl mx-auto">
            {props.children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

AppPage.displayName = "Page";

const isProductOrSolution = (item: AcceptedItem): item is Product | Solution =>
  [contentTypes.solution.codename as string, contentTypes.product.codename as string].includes(item.system.type)

  const PageMetadata: FC<Pick<Props, "item" | "defaultMetadata" | "pageType">> = ({ item, defaultMetadata, pageType }) => {
  const pageMetaTitle = createMetaTitle(siteCodename, item);
  const pageMetaDescription = item.elements.metadata__description.value || defaultMetadata.metadata__description.value;
  const pageMetaKeywords = item.elements.metadata__keywords.value || defaultMetadata.metadata__keywords.value;

  return (
    <Head>
      <title>{pageMetaTitle}</title>
      <meta
        name="description"
        content={pageMetaDescription}
      />
      <meta
        name="keywords"
        content={pageMetaKeywords}
      />
      <meta
        property="og:title"
        content={pageMetaTitle}
      />
      <meta
        property="og:description"
        content={pageMetaDescription}
      />
      <script type="application/ld+json">
        {
          JSON.stringify({
            "@context": "http://schema.org",
            "@type": pageType,
            name: item.elements.metadata__title.value
              || (isProductOrSolution(item) ? item.elements.product_base__name.value : item.elements.title.value),
            description: pageMetaDescription,
            keywords: pageMetaKeywords
          })
        }
      </script>
    </Head>
  )
}

const createMetaTitle = (siteCodename: ValidCollectionCodename, item: AcceptedItem): string => {
  const siteTitle = perCollectionSEOTitle[siteCodename];
  const pageTitle = item.elements.metadata__title.value;

  return pageTitle && pageTitle !== siteTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
};

