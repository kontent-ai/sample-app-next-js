import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";

import { Content } from "../../components/shared/Content";
import { AppPage } from "../../components/shared/ui/appPage";
import { getDefaultMetadata, getItemBySlug, getPagesSlugs, getSiteMenu } from "../../lib/kontentClient";
import { reservedListingSlugs } from "../../lib/routing";
import { parseFlatted, Stringified, stringifyAsType } from "../../lib/utils/circularityUtils";
import { defaultEnvId } from "../../lib/utils/env";
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from "../../lib/utils/pageUtils";
import { createElementSmartLink, createFixedAddSmartLink } from "../../lib/utils/smartLinkUtils";
import { contentTypes, Metadata, Nav_NavigationItem, WSL_Page } from "../../models";

type Props = Readonly<{
  page: Stringified<WSL_Page>;
  siteMenu: Stringified<Nav_NavigationItem>;
  defaultMetadata: Metadata;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
  envId: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPagesSlugs({ envId: defaultEnvId });

  const paths = slugs
    .filter(item => item != reservedListingSlugs.articles)
    .filter(item => item != reservedListingSlugs.products)
    .map(slug => (
      { params: { envId: defaultEnvId, slug } }
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
  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);
  const defaultMetadata = await getDefaultMetadata({ envId, previewApiKey }, !!context.preview);

  const pageData = await getItemBySlug<WSL_Page>({ envId, previewApiKey }, slug, contentTypes.page.codename, !!context.preview);

  if (pageData === null) {
    return {
      notFound: true
    };
  }

  const page = stringifyAsType(pageData);
  const siteMenu = stringifyAsType(siteMenuData);

  return {
    props: { page, siteMenu, defaultMetadata },
  };
}

const TopLevelPage: FC<Props> = (props) => {
  const page = parseFlatted(props.page);
  
  return (
    <AppPage
      siteMenu={props.siteMenu}
      defaultMetadata={props.defaultMetadata}
      item={page}
      pageType="WebPage"
    >
      <div
        {...createElementSmartLink(contentTypes.page.elements.content.codename)}
        {...createFixedAddSmartLink("end")}
      >
        {page.elements.content.linkedItems.map((piece) => (
          <Content
            key={piece.system.id}
            item={piece}
          />
        ))}
      </div>
    </AppPage>
  );
};

export default TopLevelPage;
