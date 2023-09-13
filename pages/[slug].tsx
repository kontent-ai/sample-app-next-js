import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";

import { Content } from "../components/shared/Content";
import { AppPage } from "../components/shared/ui/appPage";
import { getDefaultMetadata, getItemBySlug, getPagesSlugs, getSiteMenu } from "../lib/kontentClient";
import { reservedListingSlugs } from "../lib/routing";
import { ValidCollectionCodename } from "../lib/types/perCollection";
import { siteCodename } from "../lib/utils/env";
import { createElementSmartLink, createFixedAddSmartLink } from "../lib/utils/smartLinkUtils";
import { contentTypes, Metadata, Nav_NavigationItem, WSL_Page } from "../models";

type Props = Readonly<{
  page: WSL_Page;
  siteCodename: ValidCollectionCodename;
  siteMenu: Nav_NavigationItem | null;
  defaultMetadata: Metadata;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
}
export const getStaticPaths: GetStaticPaths = async () => {
  const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  if (!envId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }

  const slugs = await getPagesSlugs({ envId: envId });

  const paths = slugs
    .filter(item => item != reservedListingSlugs.articles)
    .filter(item => item != reservedListingSlugs.products)
    .map(slug => (
      { params: { slug } }
    ))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;

  if (!slug) {
    return {
      notFound: true
    }
  }
  const envId = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
  if (!envId) {
    throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
  }
  const previewApiKey = process.env.KONTENT_PREVIEW_API_KEY;

  const siteMenu = await getSiteMenu({ envId: envId, previewApiKey: previewApiKey }, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({envId: envId, previewApiKey: previewApiKey}, !!context.preview);

  const page = await getItemBySlug<WSL_Page>({envId: envId, previewApiKey: previewApiKey}, slug, contentTypes.page.codename, !!context.preview);

  if (page === null) {
    return {
      notFound: true
    };
  }

  return {
    props: { page, siteCodename, siteMenu, defaultMetadata },
  };
}

const TopLevelPage: FC<Props> = props => (
  <AppPage
    siteCodename={props.siteCodename}
    siteMenu={props.siteMenu}
    defaultMetadata={props.defaultMetadata}
    item={props.page}
    pageType="WebPage"
  >
    <div
      {...createElementSmartLink(contentTypes.page.elements.content.codename)}
      {...createFixedAddSmartLink("end")}
    >
      {props.page.elements.content.linkedItems.map(piece => (
        <Content
          key={piece.system.id}
          item={piece}
        />
      ))}
    </div>
  </AppPage>
);

export default TopLevelPage;
