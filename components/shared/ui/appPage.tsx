import Head from "next/head";
import { FC, ReactNode } from "react";

import { perCollectionSEOTitle } from "../../../lib/constants/labels";
import { ValidCollectionCodename } from "../../../lib/types/perCollection";
import { useSmartLink } from "../../../lib/useSmartLink";
import { createItemSmartLink } from "../../../lib/utils/smartLinkUtils";
import { Article, Block_Navigation, Product, SEOMetadata, WSL_WebSpotlightRoot } from "../../../models";
import { SiteCodenameProvider } from "../siteCodenameContext";
import { Footer } from "./footer";
import { Menu } from "./menu";

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  item?: WSL_WebSpotlightRoot | Article | Product;
  siteMenu?: Block_Navigation;
  defaultMetadata?: SEOMetadata;
  pageType: "Article" | "WebPage" | "Product";
}>;

export const AppPage: FC<Props> = props => {
  useSmartLink();

  const getPageTitle = (): string => {
    const siteTitle = perCollectionSEOTitle[props.siteCodename];
    const titleExtension = props.item?.elements.seoMetadataTitle.value;

    return titleExtension && titleExtension !== siteTitle ? `${siteTitle} | ${titleExtension}` : siteTitle;
  };

  const pageMetaDescription = props.item?.elements.seoMetadataDescription.value ?? props.defaultMetadata?.elements.seoMetadataDescription.value;
  const pageMetaKeywords = props.item?.elements.seoMetadataKeywords.value ?? props.defaultMetadata?.elements.seoMetadataKeywords.value;
  const pageMetaTitle = getPageTitle();

  return (
    <SiteCodenameProvider siteCodename={props.siteCodename}>
      <Head>
        <title>{pageMetaTitle}</title>
        <meta
          key="desc"
          name="description"
          content={pageMetaDescription}
        />
        <meta
          key="keywords"
          name="keywords"
          content={pageMetaKeywords}
        />
        <meta
          key="ogtitle"
          property="og:title"
          content={pageMetaTitle}
        />
        <meta
          key="ogdesc"
          property="og:description"
          content={pageMetaDescription}
        />
        <script
          key="schemaorg"
          type="application/ld+json"
        >
          {
            JSON.stringify({
              "@context": "http://schema.org",
              "@type": props.pageType,
              name: pageMetaTitle,
              description: pageMetaDescription,
              keywords: pageMetaKeywords
            })
          }
        </script>
      </Head>
      <div className="min-h-full grow flex flex-col items-center overflow-hidden">
        {props.siteMenu ? <Menu item={props.siteMenu} /> : <span>Missing top navigation. Please provide a valid navigation item in the web spotlight root.</span>}
        {/* https://tailwindcss.com/docs/typography-plugin */}
        <main
          className="py-14 md:py-20 md:px-4 sm:px-8 max-w-screen-xl grow h-full w-screen"
          {...createItemSmartLink(props.item?.system.id, true)}
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
