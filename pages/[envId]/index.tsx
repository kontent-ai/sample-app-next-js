import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Content } from '../../components/shared/Content';
import { AppPage } from '../../components/shared/ui/appPage';
import { getHomepage, getSiteMenu } from '../../lib/kontentClient';
import { useSmartLink } from '../../lib/useSmartLink';
import { parseFlatted, Stringified, stringifyAsType } from '../../lib/utils/circularityUtils';
import { defaultEnvId } from '../../lib/utils/env';
import { getEnvIdFromRouteParams, getPreviewApiKeyFromPreviewData } from '../../lib/utils/pageUtils';
import { Metadata, Nav_NavigationItem, WSL_WebSpotlightRoot } from '../../models';


type Props = Readonly<{
  homepage: Stringified<WSL_WebSpotlightRoot>;
  siteMenu: Stringified<Nav_NavigationItem>;
  metaData: Pick<Metadata, "elements">;
  isPreview: boolean;
}>;

const Home: NextPage<Props> = props => {
  const [homepage, setHomepage] = useState(parseFlatted(props.homepage));
  const sdk = useSmartLink();

  useEffect(() => {
    const getHomepage = async () => {
      const response = await fetch(`/api/homepage?preview=${props.isPreview}`);
      const data = await response.json();

      setHomepage(data);
    }

    sdk?.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        getHomepage();
      }
    });
  }, [sdk, props.isPreview]);

  return (
    <AppPage
      item={homepage}
      siteMenu={props.siteMenu}
      pageType='WebPage'
      defaultMetadata={props.metaData}
    >
      <div>
        {homepage.elements.content.linkedItems.map(item => (
          <Content
            key={item.system.id}
            item={item as any}
          />
        ))}
      </div>
    </AppPage>
  )
};

export const getStaticProps: GetStaticProps<Props, { envId: string }> = async context => {
  const envId = getEnvIdFromRouteParams(context);

  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const homepageData = await getHomepage({ envId, previewApiKey }, !!context.preview);
  const siteMenuData = await getSiteMenu({ envId, previewApiKey }, !!context.preview);

  if (!homepageData) {
    throw new Error("Can't find homepage item.");
  }

  if (!siteMenuData) {
    throw new Error("Can't find main menu item.");
  }

  const siteMenu = stringifyAsType(siteMenuData);
  const homepage = stringifyAsType(homepageData);
  const metaData = {
    elements: {
      metadataDescription: homepageData.elements.metadataDescription,
      metadataKeywords: homepageData.elements.metadataKeywords,
      metadataTitle: homepageData.elements.metadataTitle
    }
  } as const;

  return {
    props: { homepage, siteMenu, isPreview: !!context.preview, metaData },
  };
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{
    params: { envId: defaultEnvId }
  }],
  fallback: 'blocking',
})

export default Home
