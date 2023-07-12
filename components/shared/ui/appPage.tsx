import Head from "next/head";
import { FC, ReactNode } from "react";

import { perCollectionSEOTitle } from "../../../lib/constants/labels";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { useSmartLink } from "../../../lib/useSmartLink";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { Article, Block_Navigation, Product, SEOMetadata, WSL_Page, WSL_WebSpotlightRoot } from "../../../models";
import { SiteCodenameProvider } from "../siteCodenameContext";
import { Footer } from "./footer";
import { Menu } from "./menu";

type AcceptedItem = WSL_WebSpotlightRoot | Article | Product | WSL_Page;

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  item: AcceptedItem;
  siteMenu: Block_Navigation | null;
  defaultMetadata: SEOMetadata;
  pageType: "WebPage" | "Article" | "Product",
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();

  return (
    <SiteCodenameProvider siteCodename={props.siteCodename}>
      <PageMetadata
        item={props.item}
        pageType={props.pageType}
        defaultMetadata={props.defaultMetadata}
        siteCodename={props.siteCodename}
      />
      <div className="min-h-full grow flex flex-col items-center overflow-hidden">
        {props.siteMenu ? <Menu item={props.siteMenu} /> : <span>Missing top navigation. Please provide a valid navigation item in the web spotlight root.</span>}
        {/* https://tailwindcss.com/docs/typography-plugin */}
        <main
          className="py-14 md:py-20 md:px-4 sm:px-8 max-w-screen-xl grow h-full w-screen"
          {...createItemSmartLink(props.item.system.id, true)}
        >
          <div className="prose w-full max-w-full">
            {props.children}
          </div>
        </main>
        <Footer />
      </div>
    </SiteCodenameProvider>
  );
};

AppPage.displayName = "Page";

const PageMetadata: FC<Pick<Props, "siteCodename" | "item" | "defaultMetadata" | "pageType">> = ({ siteCodename, item, defaultMetadata, pageType }) => {
  const pageMetaTitle = createMetaTitle(siteCodename, item);
  const pageMetaDescription = item.elements.seoMetadataDescription.value || defaultMetadata.elements.seoMetadataDescription.value;
  const pageMetaKeywords = item.elements.seoMetadataKeywords.value || defaultMetadata.elements.seoMetadataKeywords.value;

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
            name: item.elements.seoMetadataTitle.value || item.elements.title.value,
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
  const pageTitle = item.elements.seoMetadataTitle.value;

  return pageTitle !== siteTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
};

